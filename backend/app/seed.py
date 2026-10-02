from __future__ import annotations

import shutil
from pathlib import Path

from app.config import ROOT
from app.db import add_photo, connect, create_project, init_db, project_folder

SEED_DIR = ROOT / "seed_photos"

SAMPLES = [
    {
        "title": "House of Lime",
        "slug": "house-of-lime",
        "location": "Pune",
        "year": 2024,
        "category": "residence",
        "featured": True,
        "visual_key": "lime",
        "description": (
            "A courtyard house opened to the west light. Lime plaster, teak, and a floor that stays cool. "
            "Rooms are sequenced from street to garden so the family can close the day without closing the house."
        ),
    },
    {
        "title": "Courtyard Kitchen",
        "slug": "courtyard-kitchen",
        "location": "Nagpur",
        "year": 2023,
        "category": "kitchen",
        "featured": True,
        "visual_key": "kitchen",
        "description": (
            "The kitchen sits on a small court. Stone counters, a single long table, and a window that takes the morning. "
            "Storage is built into the wall so the room can stay a room."
        ),
    },
    {
        "title": "North Study",
        "slug": "north-study",
        "location": "Mumbai",
        "year": 2025,
        "category": "workplace",
        "featured": True,
        "visual_key": "study",
        "description": (
            "A working room with a north window and a desk the width of the wall. Books stay in reach. "
            "The rest of the apartment is quiet; this room is for the hours that need it."
        ),
    },
]


def _attach_photos(slug: str, project_id: int) -> None:
    folder = SEED_DIR / slug
    if not folder.exists():
        return
    images = sorted(p for p in folder.iterdir() if p.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"})
    dest = project_folder(project_id)
    for image in images:
        target = dest / image.name
        if not target.exists():
            shutil.copyfile(image, target)
        with connect() as conn:
            exists = conn.execute(
                "SELECT id FROM photos WHERE project_id = ? AND filename = ?",
                (project_id, image.name),
            ).fetchone()
        if not exists:
            add_photo(project_id, image.name)


def seed_if_empty() -> None:
    init_db()
    with connect() as conn:
        count = conn.execute("SELECT COUNT(*) AS c FROM projects").fetchone()["c"]
    if not count:
        for item in SAMPLES:
            create_project(item)
    with connect() as conn:
        rows = conn.execute("SELECT id, slug FROM projects").fetchall()
    for row in rows:
        with connect() as conn:
            photo_count = conn.execute(
                "SELECT COUNT(*) AS c FROM photos WHERE project_id = ?",
                (row["id"],),
            ).fetchone()["c"]
        if photo_count == 0:
            _attach_photos(row["slug"], row["id"])
