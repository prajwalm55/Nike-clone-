import os
import dj_database_url

from .base import *  # noqa: F401,F403

DEBUG = os.environ.get('DJANGO_DEBUG', 'False').lower() == 'true'

SECRET_KEY = os.environ['DJANGO_SECRET_KEY']

ALLOWED_HOSTS = os.environ.get('DJANGO_ALLOWED_HOSTS', '').split(',')
if not ALLOWED_HOSTS or ALLOWED_HOSTS == ['']:
    raise ValueError('DJANGO_ALLOWED_HOSTS must be set in production')

# Database — PostgreSQL via DATABASE_URL, falls back to SQLite
DATABASE_URL = os.environ.get('DATABASE_URL')
if DATABASE_URL:
    DATABASES['default'] = dj_database_url.parse(DATABASE_URL, conn_max_age=600, ssl_require=False)

# CORS
CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.environ.get('CORS_ALLOWED_ORIGINS', '').split(',')
    if origin.strip()
]
if not CORS_ALLOWED_ORIGINS:
    raise ValueError('CORS_ALLOWED_ORIGINS must be set in production')

# Security
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SECURE_SSL_REDIRECT = os.environ.get('SECURE_SSL_REDIRECT', 'False').lower() == 'true'
SESSION_COOKIE_SECURE = os.environ.get('SESSION_COOKIE_SECURE', 'True').lower() == 'true'
CSRF_COOKIE_SECURE = os.environ.get('CSRF_COOKIE_SECURE', 'True').lower() == 'true'
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'

# Static files via WhiteNoise
MIDDLEWARE.insert(1, 'whitenoise.middleware.WhiteNoiseMiddleware')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedStaticFilesStorage'
