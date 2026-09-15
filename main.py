from __future__ import annotations

from uuid import uuid4

from fastapi import Depends, FastAPI, File, HTTPException, Query, Response, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app import db
from app.auth import check_credentials, clear_session, require_admin, set_session
from app.config import ALLOWED_IMAGE_TYPES, CATEGORIES, CORS_ORIGINS, UPLOAD_DIR
from app.schemas import (
    InquiryIn,
    InquiryList,
    LoginIn,
    Ok,
    PhotoPatch,
    ProjectIn,
    ProjectList,
    ProjectOut,
    ProjectPatch,
    SearchResults,
)
from app.seed import seed_if_empty

seed_if_empty()
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

app = FastAPI(title="Kotalwar Interiors API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")


def _validate_category(category: str) -> None:
    if category not in CATEGORIES:
        raise HTTPException(status_code=400, detail="Unknown category")


@app.get("/")
def root() -> dict:
    return {"service": "Kotalwar Interiors API", "docs": "/docs", "health": "/api/health"}


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok"}


@app.get("/api/projects", response_model=ProjectList)
def list_projects(
    featured: int = Query(default=0),
    hero: int = Query(default=0),
    category: str = Query(default=""),
) -> ProjectList:
    items = db.list_projects(
        featured=True if featured else None,
        hero=True if hero else None,
        category=category or None,
    )
    return ProjectList(items=[ProjectOut(**item) for item in items])


@app.get("/api/projects/{slug}", response_model=ProjectOut)
def project_detail(slug: str) -> ProjectOut:
    item = db.get_project_by_slug(slug)
    if not item:
        raise HTTPException(status_code=404, detail="Project not found")
    return ProjectOut(**item)


@app.get("/api/search", response_model=SearchResults)
def search(q: str = Query(default="", max_length=80)) -> SearchResults:
    if not q.strip():
        return SearchResults(items=[])
    return SearchResults(items=db.search_projects(q.strip()))


@app.post("/api/inquiries", response_model=Ok)
def create_inquiry(body: InquiryIn) -> Ok:
    db.add_inquiry(body.model_dump())
    return Ok(ok=True, message="Thank you. The studio will write back.")


@app.post("/api/admin/login", response_model=Ok)
def login(body: LoginIn, response: Response) -> Ok:
    if not check_credentials(body.username, body.password):
        raise HTTPException(status_code=401, detail="Wrong username or password")
    set_session(response)
    return Ok(ok=True, message="Signed in")


@app.post("/api/admin/logout", response_model=Ok)
def logout(response: Response) -> Ok:
    clear_session(response)
    return Ok(ok=True)


@app.get("/api/admin/me")
def me(_: str = Depends(require_admin)) -> dict:
    return {"ok": True, "role": "admin"}


@app.get("/api/admin/projects", response_model=ProjectList)
def admin_projects(_: str = Depends(require_admin)) -> ProjectList:
    return ProjectList(items=[ProjectOut(**item) for item in db.list_projects()])


@app.post("/api/admin/projects", response_model=ProjectOut)
def admin_create(body: ProjectIn, _: str = Depends(require_admin)) -> ProjectOut:
    _validate_category(body.category)
    return ProjectOut(**db.create_project(body.model_dump()))


@app.get("/api/admin/projects/{project_id}", response_model=ProjectOut)
def admin_get(project_id: int, _: str = Depends(require_admin)) -> ProjectOut:
    item = db.get_project_by_id(project_id)
    if not item:
        raise HTTPException(status_code=404, detail="Project not found")
    return ProjectOut(**item)


@app.patch("/api/admin/projects/{project_id}", response_model=ProjectOut)
def admin_patch(project_id: int, body: ProjectPatch, _: str = Depends(require_admin)) -> ProjectOut:
    data = body.model_dump(exclude_unset=True)
    if "category" in data and data["category"] is not None:
        _validate_category(data["category"])
    item = db.update_project(project_id, data)
    if not item:
        raise HTTPException(status_code=404, detail="Project not found")
    return ProjectOut(**item)


@app.post("/api/admin/projects/{project_id}/hero", response_model=ProjectOut)
def admin_set_hero(project_id: int, _: str = Depends(require_admin)) -> ProjectOut:
    item = db.set_hero(project_id)
    if not item:
        raise HTTPException(status_code=404, detail="Project not found")
    return ProjectOut(**item)


@app.delete("/api/admin/projects/{project_id}", response_model=Ok)
def admin_delete(project_id: int, _: str = Depends(require_admin)) -> Ok:
    if not db.delete_project(project_id):
        raise HTTPException(status_code=404, detail="Project not found")
    return Ok(ok=True)


@app.post("/api/admin/projects/{project_id}/photos", response_model=ProjectOut)
async def admin_upload(
    project_id: int,
    file: UploadFile = File(...),
    _: str = Depends(require_admin),
) -> ProjectOut:
    if not db.get_project_by_id(project_id):
        raise HTTPException(status_code=404, detail="Project not found")
    content_type = file.content_type or ""
    ext = ALLOWED_IMAGE_TYPES.get(content_type)
    if not ext:
        raise HTTPException(status_code=400, detail="Use a JPEG, PNG, or WebP image")
    filename = f"{uuid4().hex}{ext}"
    folder = db.project_folder(project_id)
    path = folder / filename
    data = await file.read()
    if len(data) > 12 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Image is larger than 12 MB")
    path.write_bytes(data)
    item = db.add_photo(project_id, filename)
    return ProjectOut(**item)


@app.patch("/api/admin/photos/{photo_id}", response_model=ProjectOut)
def admin_photo_patch(photo_id: int, body: PhotoPatch, _: str = Depends(require_admin)) -> ProjectOut:
    item = db.patch_photo(photo_id, body.is_cover, body.sort_order)
    if not item:
        raise HTTPException(status_code=404, detail="Photo not found")
    return ProjectOut(**item)


@app.delete("/api/admin/photos/{photo_id}", response_model=Ok)
def admin_photo_delete(photo_id: int, _: str = Depends(require_admin)) -> Ok:
    if db.delete_photo(photo_id) is None:
        raise HTTPException(status_code=404, detail="Photo not found")
    return Ok(ok=True)


@app.get("/api/admin/inquiries", response_model=InquiryList)
def admin_inquiries(_: str = Depends(require_admin)) -> InquiryList:
    return InquiryList(items=db.list_inquiries())
