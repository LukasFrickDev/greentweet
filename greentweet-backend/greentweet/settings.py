"""Django settings for the GreenTweet project."""

import os
from datetime import timedelta
from pathlib import Path

import dj_database_url
from dotenv import load_dotenv


# Local values are a convenience only; platform environment variables must win.
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent


def env_list(name: str) -> list[str]:
    """Read a comma-separated environment variable, ignoring empty values."""
    return [value.strip() for value in os.getenv(name, "").split(",") if value.strip()]


SECRET_KEY = os.getenv("SECRET_KEY")
DEBUG = os.getenv("DEBUG", "False").lower() == "true"

ALLOWED_HOSTS = env_list("ALLOWED_HOSTS")
vercel_url = os.getenv("VERCEL_URL", "").strip()
if vercel_url:
    vercel_host = vercel_url.removeprefix("https://").removeprefix("http://").split("/", 1)[0]
    if vercel_host and vercel_host not in ALLOWED_HOSTS:
        ALLOWED_HOSTS.append(vercel_host)

CSRF_TRUSTED_ORIGINS = env_list("CSRF_TRUSTED_ORIGINS")


INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "corsheaders",
    "users",
    "profiles.apps.ProfilesConfig",
    "follows",
    "posts",
    "likes",
    "comments",
    "notifications",
    "search",
    "cloudinary",
    "cloudinary_storage",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "greentweet.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "greentweet.wsgi.application"


# Local development supports the existing individual PostgreSQL variables.
# Production must provide DATABASE_URL; it is expected to be Neon\'s pooled URL.
database_url = os.getenv("DATABASE_URL", "").strip()
if database_url:
    DATABASES = {
        "default": dj_database_url.config(
            default=database_url,
            conn_max_age=0,
            ssl_require=True,
        )
    }
    # Neon/PgBouncer pools do not support server-side cursors reliably.
    DATABASES["default"]["DISABLE_SERVER_SIDE_CURSORS"] = True
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": (os.getenv("DB_NAME") or "").strip(),
            "USER": (os.getenv("DB_USER") or "").strip(),
            "PASSWORD": (os.getenv("DB_PASSWORD") or "").strip(),
            "HOST": (os.getenv("DB_HOST", "localhost") or "localhost").strip(),
            "PORT": (os.getenv("DB_PORT", "5432") or "5432").strip(),
        }
    }


AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

STATIC_URL = "/static/"
STATICFILES_DIRS = []
STATIC_ROOT = BASE_DIR / "staticfiles"

MEDIA_URL = "/media/"
USE_CLOUDINARY = os.getenv("USE_CLOUDINARY", "False").lower() == "true"

STORAGES = {
    "default": {
        "BACKEND": "cloudinary_storage.storage.MediaCloudinaryStorage"
        if USE_CLOUDINARY
        else "django.core.files.storage.FileSystemStorage",
    },
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}

if USE_CLOUDINARY:
    CLOUDINARY_STORAGE = {
        "CLOUD_NAME": os.getenv("CLOUDINARY_CLOUD_NAME"),
        "API_KEY": os.getenv("CLOUDINARY_API_KEY"),
        "API_SECRET": os.getenv("CLOUDINARY_API_SECRET"),
        "SECURE": True,
    }
    MEDIA_ROOT = None
else:
    MEDIA_ROOT = BASE_DIR / "media"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

# In production the allow-list is explicit. Local Vite is only allowed in DEBUG.
CORS_ALLOWED_ORIGINS = env_list("CORS_ALLOWED_ORIGINS")
if DEBUG and "http://localhost:5173" not in CORS_ALLOWED_ORIGINS:
    CORS_ALLOWED_ORIGINS.append("http://localhost:5173")

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    )
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=30),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
    "AUTH_HEADER_TYPES": ("Bearer",),
}
