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
# MEDIA FILES CONFIGURATION (ADD THIS)
# ---------------------------------------------------
MEDIA_URL = '/media/'  # URL to access media files
MEDIA_ROOT = BASE_DIR / 'media'  # Directory where media files are stored

# ---------------------------------------------------

# ---------------------------------------------------
if not DEBUG:
    # Option 1: Cloudinary (Easier to set up)
    CLOUDINARY_STORAGE = {
        'CLOUD_NAME': env('CLOUDINARY_CLOUD_NAME', default=''),
        'API_KEY': env('CLOUDINARY_API_KEY', default=''),
        'API_SECRET': env('CLOUDINARY_API_SECRET', default=''),
    }
DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'


# Installed apps
# ---------------------------------------------------
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
   

    # Third-party apps
    'rest_framework',
    'corsheaders',
    'cloudinary_storage',  
    'cloudinary', 

    # Local apps
    'events',
    'partners',
]

# ---------------------------------------------------
# Middleware
# ---------------------------------------------------
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
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
        'DIRS': [],
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
# Static files
# ---------------------------------------------------
STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# ---------------------------------------------------
# Default primary key field type
# ---------------------------------------------------
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

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
]

CORS_ALLOW_CREDENTIALS = True

