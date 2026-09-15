from __future__ import annotations

import re
import sqlite3
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, Iterator, List, Optional

from app.config import DATA_DIR, DB_PATH, UPLOAD_DIR

SCHEMA = """
CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    location TEXT NOT NULL,
    year INTEGER NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    featured INTEGER NOT NULL DEFAULT 0,
    is_hero INTEGER NOT NULL DEFAULT 0,
    visual_key TEXT,
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS photos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    filename TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_cover INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS inquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    created_at TEXT NOT NULL
);
"""


def slugify(value: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return slug or "project"


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def photo_url(project_id: int, filename: str) -> str:
    return f"/uploads/projects/{project_id}/{filename}"


@contextmanager
def connect() -> Iterator[sqlite3.Connection]:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(DB_PATH), timeout=30)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()


def init_db() -> None:
    with connect() as conn:
        conn.executescript(SCHEMA)
        cols = [r[1] for r in conn.execute("PRAGMA table_info(projects)").fetchall()]
        added_hero = False
        if "is_hero" not in cols:
            conn.execute("ALTER TABLE projects ADD COLUMN is_hero INTEGER NOT NULL DEFAULT 0")
            added_hero = True
        if added_hero:
            row = conn.execute(
                "SELECT id FROM projects WHERE featured = 1 ORDER BY year DESC, id DESC LIMIT 1"
            ).fetchone()
            if row:
                conn.execute("UPDATE projects SET is_hero = 1 WHERE id = ?", (row["id"],))


def _photos_for(conn: sqlite3.Connection, project_id: int) -> List[Dict[str, Any]]:
    rows = conn.execute(
        "SELECT * FROM photos WHERE project_id = ? ORDER BY sort_order, id",
        (project_id,),
    ).fetchall()
    return [
        {
            "id": row["id"],
            "url": photo_url(project_id, row["filename"]),
            "sort_order": row["sort_order"],
            "is_cover": bool(row["is_cover"]),
        }
        for row in rows
    ]


def project_dict(conn: sqlite3.Connection, row: sqlite3.Row) -> Dict[str, Any]:
    photos = _photos_for(conn, row["id"])
    cover = next((p["url"] for p in photos if p["is_cover"]), None)
    if not cover and photos:
        cover = photos[0]["url"]
    return {
        "id": row["id"],
        "slug": row["slug"],
        "title": row["title"],
        "location": row["location"],
        "year": row["year"],
        "category": row["category"],
        "description": row["description"],
        "featured": bool(row["featured"]),
        "is_hero": bool(row["is_hero"]),
        "visual_key": row["visual_key"],
        "cover_url": cover,
        "photos": photos,
    }


def list_projects(
    featured: Optional[bool] = None,
    category: Optional[str] = None,
    hero: Optional[bool] = None,
) -> List[Dict[str, Any]]:
    sql = "SELECT * FROM projects WHERE 1=1"
    args: List[Any] = []
    if featured:
        sql += " AND featured = 1"
    if hero:
        sql += " AND is_hero = 1"
    if category:
        sql += " AND category = ?"
        args.append(category)
    sql += " ORDER BY is_hero DESC, featured DESC, year DESC, id DESC"
    with connect() as conn:
        rows = conn.execute(sql, args).fetchall()
        return [project_dict(conn, row) for row in rows]


def get_project_by_slug(slug: str) -> Optional[Dict[str, Any]]:
    with connect() as conn:
        row = conn.execute("SELECT * FROM projects WHERE slug = ?", (slug,)).fetchone()
        return project_dict(conn, row) if row else None


def get_project_by_id(project_id: int) -> Optional[Dict[str, Any]]:
    with connect() as conn:
        row = conn.execute("SELECT * FROM projects WHERE id = ?", (project_id,)).fetchone()
        return project_dict(conn, row) if row else None


def unique_slug(conn: sqlite3.Connection, base: str, exclude_id: Optional[int] = None) -> str:
    slug = slugify(base)
    n = 2
    candidate = slug
    while True:
        row = conn.execute("SELECT id FROM projects WHERE slug = ?", (candidate,)).fetchone()
        if not row or (exclude_id is not None and row["id"] == exclude_id):
            return candidate
        candidate = f"{slug}-{n}"
        n += 1


def create_project(data: Dict[str, Any]) -> Dict[str, Any]:
    with connect() as conn:
        slug = unique_slug(conn, data.get("slug") or data["title"])
        cur = conn.execute(
            """
            INSERT INTO projects (slug, title, location, year, category, description, featured, is_hero, visual_key, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                slug,
                data["title"],
                data["location"],
                data["year"],
                data["category"],
                data["description"],
                1 if data.get("featured") else 0,
                1 if data.get("is_hero") else 0,
                data.get("visual_key"),
                now_iso(),
            ),
        )
        if data.get("is_hero"):
            conn.execute("UPDATE projects SET is_hero = 0 WHERE id != ?", (cur.lastrowid,))
        row = conn.execute("SELECT * FROM projects WHERE id = ?", (cur.lastrowid,)).fetchone()
        return project_dict(conn, row)


def update_project(project_id: int, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    with connect() as conn:
        row = conn.execute("SELECT * FROM projects WHERE id = ?", (project_id,)).fetchone()
        if not row:
            return None
        fields = {key: row[key] for key in row.keys()}
        for key, value in data.items():
            fields[key] = value
        slug = unique_slug(conn, fields.get("slug") or fields["title"], exclude_id=project_id)
        conn.execute(
            """
            UPDATE projects SET slug=?, title=?, location=?, year=?, category=?, description=?, featured=?, visual_key=?
            WHERE id=?
            """,
            (
                slug,
                fields["title"],
                fields["location"],
                fields["year"],
                fields["category"],
                fields["description"],
                1 if fields.get("featured") else 0,
                fields.get("visual_key"),
                project_id,
            ),
        )
    if "is_hero" in data:
        if data["is_hero"]:
            return set_hero(project_id)
        with connect() as conn:
            conn.execute("UPDATE projects SET is_hero = 0 WHERE id = ?", (project_id,))
            row = conn.execute("SELECT * FROM projects WHERE id = ?", (project_id,)).fetchone()
            return project_dict(conn, row)
    return get_project_by_id(project_id)


def set_hero(project_id: int) -> Optional[Dict[str, Any]]:
    with connect() as conn:
        row = conn.execute("SELECT id FROM projects WHERE id = ?", (project_id,)).fetchone()
        if not row:
            return None
        conn.execute("UPDATE projects SET is_hero = 0")
        conn.execute("UPDATE projects SET is_hero = 1 WHERE id = ?", (project_id,))
        row = conn.execute("SELECT * FROM projects WHERE id = ?", (project_id,)).fetchone()
        return project_dict(conn, row)


def delete_project(project_id: int) -> bool:
    folder = UPLOAD_DIR / "projects" / str(project_id)
    with connect() as conn:
        cur = conn.execute("DELETE FROM projects WHERE id = ?", (project_id,))
        if cur.rowcount == 0:
            return False
    if folder.exists():
        for file in folder.iterdir():
            file.unlink()
        folder.rmdir()
    return True


def add_photo(project_id: int, filename: str) -> Optional[Dict[str, Any]]:
    with connect() as conn:
        project = conn.execute("SELECT id FROM projects WHERE id = ?", (project_id,)).fetchone()
        if not project:
            return None
        max_sort = conn.execute(
            "SELECT COALESCE(MAX(sort_order), -1) AS m FROM photos WHERE project_id = ?",
            (project_id,),
        ).fetchone()["m"]
        count = conn.execute("SELECT COUNT(*) AS c FROM photos WHERE project_id = ?", (project_id,)).fetchone()["c"]
        is_cover = 1 if count == 0 else 0
        conn.execute(
            "INSERT INTO photos (project_id, filename, sort_order, is_cover) VALUES (?, ?, ?, ?)",
            (project_id, filename, max_sort + 1, is_cover),
        )
        row = conn.execute("SELECT * FROM projects WHERE id = ?", (project_id,)).fetchone()
        return project_dict(conn, row)


def patch_photo(photo_id: int, is_cover: Optional[bool], sort_order: Optional[int]) -> Optional[Dict[str, Any]]:
    with connect() as conn:
        photo = conn.execute("SELECT * FROM photos WHERE id = ?", (photo_id,)).fetchone()
        if not photo:
            return None
        if is_cover:
            conn.execute("UPDATE photos SET is_cover = 0 WHERE project_id = ?", (photo["project_id"],))
            conn.execute("UPDATE photos SET is_cover = 1 WHERE id = ?", (photo_id,))
        if sort_order is not None:
            conn.execute("UPDATE photos SET sort_order = ? WHERE id = ?", (sort_order, photo_id))
        row = conn.execute("SELECT * FROM projects WHERE id = ?", (photo["project_id"],)).fetchone()
        return project_dict(conn, row)


def delete_photo(photo_id: int) -> Optional[int]:
    with connect() as conn:
        photo = conn.execute("SELECT * FROM photos WHERE id = ?", (photo_id,)).fetchone()
        if not photo:
            return None
        conn.execute("DELETE FROM photos WHERE id = ?", (photo_id,))
        remaining = conn.execute(
            "SELECT id FROM photos WHERE project_id = ? AND is_cover = 1",
            (photo["project_id"],),
        ).fetchone()
        if not remaining:
            first = conn.execute(
                "SELECT id FROM photos WHERE project_id = ? ORDER BY sort_order, id",
                (photo["project_id"],),
            ).fetchone()
            if first:
                conn.execute("UPDATE photos SET is_cover = 1 WHERE id = ?", (first["id"],))
        project_id = photo["project_id"]
    path = UPLOAD_DIR / "projects" / str(project_id) / photo["filename"]
    if path.exists():
        path.unlink()
    return project_id


def search_projects(q: str) -> List[Dict[str, Any]]:
    needle = f"%{q.lower()}%"
    with connect() as conn:
        rows = conn.execute(
            """
            SELECT slug, title, location, category FROM projects
            WHERE lower(title) LIKE ? OR lower(location) LIKE ? OR lower(description) LIKE ? OR lower(category) LIKE ?
            ORDER BY year DESC LIMIT 8
            """,
            (needle, needle, needle, needle),
        ).fetchall()
        return [
            {
                "slug": row["slug"],
                "title": row["title"],
                "location": row["location"],
                "category": row["category"],
                "type": "project",
            }
            for row in rows
        ]


def add_inquiry(data: Dict[str, Any]) -> None:
    with connect() as conn:
        conn.execute(
            "INSERT INTO inquiries (name, email, phone, message, created_at) VALUES (?, ?, ?, ?, ?)",
            (data["name"], data["email"], data.get("phone"), data["message"], now_iso()),
        )


def list_inquiries() -> List[Dict[str, Any]]:
    with connect() as conn:
        rows = conn.execute("SELECT * FROM inquiries ORDER BY id DESC").fetchall()
        return [
            {
                "id": row["id"],
                "name": row["name"],
                "email": row["email"],
                "phone": row["phone"],
                "message": row["message"],
                "created_at": row["created_at"],
            }
            for row in rows
        ]


def project_folder(project_id: int) -> Path:
    path = UPLOAD_DIR / "projects" / str(project_id)
    path.mkdir(parents=True, exist_ok=True)
    return path
