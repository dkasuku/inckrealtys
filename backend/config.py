import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")

# Default upload target: the Next.js public/uploads folder, so images are
# served statically by Next at /uploads/<file>.
DEFAULT_UPLOAD_DIR = BASE_DIR.parent / "nextjs" / "public" / "uploads"


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "change-me-in-production")

    # Postgres, e.g. postgresql+psycopg://user:pass@localhost:5432/inck_realty
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL", "postgresql+psycopg://postgres:postgres@localhost:5432/inck_realty"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    UPLOAD_DIR = Path(os.getenv("UPLOAD_DIR", str(DEFAULT_UPLOAD_DIR)))
    # Public URL prefix that maps to UPLOAD_DIR
    UPLOAD_URL_PREFIX = os.getenv("UPLOAD_URL_PREFIX", "/uploads")
    MAX_CONTENT_LENGTH = int(os.getenv("MAX_UPLOAD_MB", "10")) * 1024 * 1024
    ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp", "gif", "avif", "svg"}

    JWT_EXPIRES_HOURS = int(os.getenv("JWT_EXPIRES_HOURS", "12"))

    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")

    # Seeded admin
    ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "admin@inckrealty.co.ke")
    ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "ChangeMe123!")
