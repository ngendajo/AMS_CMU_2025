
from pathlib import Path
# Add this import
from datetime import timedelta
import os
from django.core.management.base import BaseCommand
from django.apps import apps
from django.db.models import Q
from django.conf import settings
from django.db.models import FileField
class Command(BaseCommand):
    help = "This command deletes all media files from the MEDIA_ROOT directory which are no longer referenced by any of the models from installed_apps"
    def handle(self, *args, **options):
        all_models = apps.get_models()
        physical_files = set()
        db_files = set()
        # Get all files from the database
        for model in all_models:
            file_fields = []
            filters = Q()
            for f_ in model._meta.fields:
                if isinstance(f_, FileField):
                    file_fields.append(f_.name)
                    is_null = {'{}__isnull'.format(f_.name): True}
                    is_empty = {'{}__exact'.format(f_.name): ''}
                    filters &= Q(**is_null) | Q(**is_empty)
            # only retrieve the models which have non-empty, non-null file fields
            if file_fields:
                files = model.objects.exclude(filters).values_list(*file_fields, flat=True).distinct()
                db_files.update(files)
        # Get all files from the MEDIA_ROOT, recursively
        media_root = getattr(settings, 'MEDIA_ROOT', None)
        if media_root is not None:
            for relative_root, dirs, files in os.walk(media_root):
                for file_ in files:
                    # Compute the relative file path to the media directory, so it can be compared to the values from the db
                    relative_file = os.path.join(os.path.relpath(relative_root, media_root), file_)
                    physical_files.add(relative_file)
        # Compute the difference and delete those files
        deletables = physical_files - db_files
        if deletables:
            for file_ in deletables:
                os.remove(os.path.join(media_root, file_))
            # Bottom-up - delete all empty folders
            for relative_root, dirs, files in os.walk(media_root, topdown=False):
                for dir_ in dirs:
                    if not os.listdir(os.path.join(relative_root, dir_)):
                        os.rmdir(os.path.join(relative_root, dir_))


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Actual directory user files go to
MEDIA_ROOT = os.path.join(os.path.dirname(BASE_DIR), 'media')

# URL used to access the media
MEDIA_URL = '/media/'


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-5ye&$4bd)ss*-p8pp%z7f5nj4@br=2!hp_2i3b(dbb@_om#zok'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

ALLOWED_HOSTS = []
""" ALLOWED_HOSTS = ['10.10.88.228','backend.asyv.ac.rw'] """


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework_simplejwt.token_blacklist',
    'corsheaders',
    'api',
    'userprofile',
    'import_export',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]
# Add this
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    )
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=5),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=50),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': False,

    'ALGORITHM': 'HS256',

    'VERIFYING_KEY': None,
    'AUDIENCE': None,
    'ISSUER': None,
    'JWK_URL': None,
    'LEEWAY': 0,

    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    'USER_AUTHENTICATION_RULE': 'rest_framework_simplejwt.authentication.default_user_authentication_rule',

    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',
    'TOKEN_USER_CLASS': 'rest_framework_simplejwt.models.TokenUser',

    'JTI_CLAIM': 'jti',

    'SLIDING_TOKEN_REFRESH_EXP_CLAIM': 'refresh_exp',
    'SLIDING_TOKEN_LIFETIME': timedelta(minutes=5),
    'SLIDING_TOKEN_REFRESH_LIFETIME': timedelta(days=1),
}



WSGI_APPLICATION = 'backend.wsgi.application'


# Database
# https://docs.djangoproject.com/en/3.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'asyvams',
        'USER': 'postgres',
        'PASSWORD': 'asyvams',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}


# Password validation
# https://docs.djangoproject.com/en/3.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/3.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.2/howto/static-files/

STATIC_URL = '/static/'

# Default primary key field type
# https://docs.djangoproject.com/en/3.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

CORS_ALLOW_ALL_ORIGINS = True  
# If this is used then `CORS_ALLOWED_ORIGINS` will not have any effect
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
] # If this is used, then not need to use `CORS_ALLOW_ALL_ORIGINS = True`
CORS_ALLOWED_ORIGIN_REGEXES = [
    'http://localhost:3000', 
]  
CSRF_TRUSTED_ORIGINS = ['http://localhost:3000']

AUTH_USER_MODEL = 'api.User'
