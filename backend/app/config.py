from __future__ import annotations

import os
from pathlib import Path

from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[1]
load_dotenv(ROOT / ".env")


def _truthy(name: str) -> bool:
    return os.getenv(name, "").strip().lower() in ("1", "true", "yes")


ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "kotalwar")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "kotalwar-studio")
SESSION_SECRET = os.getenv("SESSION_SECRET", "kotalwar-dev-session-change-me")
CORS_ORIGINS = [o.strip() for o in os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",") if o.strip()]
COOKIE_SECURE = _truthy("COOKIE_SECURE") or _truthy("RENDER")

DATA_DIR = ROOT / "data"
UPLOAD_DIR = ROOT / "uploads"
DB_PATH = DATA_DIR / "studio.db"
COOKIE_NAME = "kotalwar_admin"

CATEGORIES = ("residence", "kitchen", "living", "workplace", "other")
ALLOWED_IMAGE_TYPES = {"image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp"}
