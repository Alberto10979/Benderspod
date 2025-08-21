import environ
from pathlib import Path

# ---------------------------------------------------
# Base directory
# ---------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent

# ---------------------------------------------------
# Environment variables
# ---------------------------------------------------
env = environ.Env(
    DEBUG=(bool, False)  # Default debug to False for safety
)

# Read .env file
environ.Env.read_env(BASE_DIR / ".env")

# ---------------------------------------------------
# Core settings
# ---------------------------------------------------
SECRET_KEY = env("SECRET_KEY")
DEBUG = env("DEBUG")

ALLOWED_HOSTS = ['*'] if DEBUG else [
    'benderspod-production-1776.up.railway.app',
    'www.benderspod.co.ke',
    'benderspod.co.ke',
    'localhost',
    '127.0.0.1',
]

# ---------------------------------------------------
# Cloudinary Configuration - UPDATED
# ---------------------------------------------------
import cloudinary
import cloudinary.api
import cloudinary.uploader

# Configure Cloudinary
cloudinary.config(
    cloud_name=env('CLOUDINARY_CLOUD_NAME'),
    api_key=env('CLOUDINARY_API_KEY'),
    api_secret=env('CLOUDINARY_API_SECRET'),
    secure=True
)

# Set Cloudinary as default storage for both media and static files
CLOUDINARY_STORAGE = {
    'CLOUD_NAME': env('CLOUDINARY_CLOUD_NAME'),
    'API_KEY': env('CLOUDINARY_API_KEY'),
    'API_SECRET': env('CLOUDINARY_API_SECRET'),
    'SECURE': True,
    # Optional: Set folder for media files
    'MEDIA_TAG': 'benderspod_media',
    # Optional: Set folder for static files
    'STATIC_TAG': 'benderspod_static',
}

# Use Cloudinary for media files
DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'

# Optional: Use Cloudinary for static files too (recommended)
STATICFILES_STORAGE = 'cloudinary_storage.storage.StaticHashedCloudinaryStorage'

# Media files configuration (Cloudinary will handle these)
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'  # This is fallback, Cloudinary is primary

# Static files configuration (Cloudinary will handle these)
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'  # This is fallback, Cloudinary is primary

# Additional static files directories
STATICFILES_DIRS = [
    BASE_DIR / 'static',
]

# ---------------------------------------------------
# Installed apps - UPDATED ORDER
# ---------------------------------------------------
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    
    # Cloudinary apps (must be before staticfiles)
    'cloudinary',
    'cloudinary_storage',
    
    'django.contrib.staticfiles',

    # Third-party apps
    'rest_framework',
    'corsheaders',

    # Local apps
    'events',
    'partners',
      # Add your predictions app if you haven't
]

# ---------------------------------------------------
# Middleware
# ---------------------------------------------------
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    # Remove whitenoise if using Cloudinary for static files
    # 'whitenoise.middleware.WhiteNoiseMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# ---------------------------------------------------
# URLs & WSGI
# ---------------------------------------------------
ROOT_URLCONF = 'backendproduction.urls'
WSGI_APPLICATION = 'backendproduction.wsgi.application'

# ---------------------------------------------------
# Templates
# ---------------------------------------------------
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# ---------------------------------------------------
# Database
# ---------------------------------------------------
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': env("DB_NAME"),
        'USER': env("DB_USER"),
        'PASSWORD': env("DB_PASSWORD"),
        'HOST': env("DB_HOST"),
        'PORT': env("DB_PORT"),
    }
}

# ---------------------------------------------------
# Password validation
# ---------------------------------------------------
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# ---------------------------------------------------
# Internationalization
# ---------------------------------------------------
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# ---------------------------------------------------
# Security & HTTPS
# ---------------------------------------------------
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SECURE_SSL_REDIRECT = not DEBUG
SESSION_COOKIE_SECURE = not DEBUG
CSRF_COOKIE_SECURE = not DEBUG

CSRF_TRUSTED_ORIGINS = [
    'https://benderspod-production-1776.up.railway.app',
    'https://benderspod.co.ke',
    'https://www.benderspod.co.ke',
]

CORS_ALLOWED_ORIGINS = [
    "https://benderspod.co.ke",
    "https://www.benderspod.co.ke",
    "http://localhost:3000",  # For local development
    "http://127.0.0.1:3000",  # For local development
]

CORS_ALLOW_CREDENTIALS = True

# ---------------------------------------------------
# REST Framework Settings
# ---------------------------------------------------
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
    'DEFAULT_PARSER_CLASSES': [
        'rest_framework.parsers.JSONParser',
        'rest_framework.parsers.FormParser',
        'rest_framework.parsers.MultiPartParser',
    ],
}