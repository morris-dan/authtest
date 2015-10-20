# AuthTest

How to create a Django project from scratch

Setup a directory for the project to live in:

    > mkdir authtest
    > cd authtest

Setup an .editorconfig file per the file included in the project.

Create a virtual environment:

    > mkvirtualenv authtest

Setup a git repository:

    > git init

Upgrade your pip and install Django, and update your pip requirements file:

    > pip install --upgrade pip
    > pip install django
    > pip install psycopg2
    > pip freeze > pip-reqs.txt

Create the initial project:

    > django-admin startproject authtest

Move and rename the base django project directory to avoid having repeated names and to distinguish form the frontend code, and copy Django's management command back into the root, then add that directory to the virtual environment:

    > mv authtest backend
    > mv backend/manage.py .
    > add2virtualenv backend

Create a postgres database:

    > createdb authtest

Edit backend/authtest/settings.py so that Django uses Postgres over the default sqlite:

``` python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'authtest',
    }
}
```

While this time, this command has nothing to do, run the db change generation / migration process once to pre-empt the warning that no migrations have yet taken place:

    > ./manage.py makemigrations
    > ./manage.py migrate

Run the server and check that all is good:

    > ./manage.py runserver
 
You should see the following if you visit http://localhost:8000:

    It worked!
    Congratulations on your first Django-powered page.

Congratulations!!  Have a beer.

Now install the Django REST Framework

    > pip install djangorestframework
    > pip install djangorestframework-jwt
    > pip freeze > pip-reqs.txt

Add the following to settings.py:

``` python
# Django Rest Framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_jwt.authentication.JSONWebTokenAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
       'rest_framework.permissions.AllowAny',
    ),
    'EXCEPTION_HANDLER': 'common.server_errors.graceful_exception_handler',
}

from datetime import timedelta

JWT_AUTH = {
    'JWT_EXPIRATION_DELTA': timedelta(minutes=60),
    'JWT_ALLOW_REFRESH': True,
}
```
