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

We should make a superuser who had administrative access:

    > .django-admin createsuperuser

Run the server and check that all is good:

    > ./manage.py runserver
 
You should see the following if you visit (http://localhost:8000):

    It worked!
    Congratulations on your first Django-powered page.

Congratulations!!  You have a working Django installation.

Have a beer.

# Django Rest Framework

Now install the [Django REST Framework](http://www.django-rest-framework.org/)

    > pip install djangorestframework
    > pip install djangorestframework-jwt
    > pip freeze > pip-reqs.txt

Add the following to settings.py to use JWT for authentication, but which currently leaves all resources accessible to all users:

``` python

INSTALLED_APPS = (
    'rest_framework',
    ...
)

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

That will allow us to use Django as a RESTful API.

If we add the restframework urls, we can view a login page and a logout url

``` python
urlpatterns = [
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
]
```

Make sure that you're working in the backend directory:

    > cd backend

Let's create a Django application which encapsulates some entities.

    > django-admin startapp snippet

We want to use a JSON field in our model, so let's use [django-extensions](https://github.com/django-extensions/django-extensions) which includes a non-broken JSONField

    > pip install django-extensions
    > pip freeze > pip-reqs.txt

Lets define our model in `backend/snippets/models.py`:

``` python
import uuid
from django.utils import timezone

from django.db import models
from django_extensions.db.fields.json import JSONField

class Snippet(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    content = JSONField()
    created = models.DateTimeField(default=timezone.now)

    @property
    def results(self):
        results = {"alpha": 123.678} # This is an example computed property
        return results

```

Let's define how we serialize our model into JSON for the REST framework in `backend/snippets/serializers.py`:

``` python
from rest_framework import serializers

from .models import Snippet

class SnippetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Snippet
        fields = (
            'uuid',
            'content',
            'results',
            )
        read_only_fields = (
            'uuid',
            'created',
            )

```

Let's define some views which will serialize the models.  We are going to use the REST frameworks' generic API views, `ListCreateAPIView` and `RetrieveUPdateDestroyAPIView` to do the heavy work:

``` python
from rest_framework.generics import *

from snippets.models import Snippet
from snippets.serializers import SnippetSerializer

class SnippetCreate(ListCreateAPIView):
    queryset = Snippet.objects.all()
    serializer_class = SnippetSerializer

class SnippetDetail(RetrieveUpdateDestroyAPIView):
    queryset = Snippet.objects.all()
    serializer_class = SnippetSerializer
    lookup_field = 'uuid'

snippet_create = SnippetCreate.as_view()
snippet_detail = SnippetDetail.as_view()

```

Now let's define the actual endpoints which will use these views to provide CRUD functionality:

``` python
from django.conf.urls import url
from rest_framework.urlpatterns import format_suffix_patterns
from .views import snippet_create, snippet_detail

urlpatterns = [
    url(r'^snippets/$', snippet_create, name="create"),
    url(r'^snippets/(?P<uuid>.{36})/$', snippet_detail, name="detail"),
]

urlpatterns = format_suffix_patterns(urlpatterns)
```

Then make the project aware of the snippets app by entering it into `INSTALLED_APPS` in `backend\authtest\settings.py`:

``` python

INSTALLED_APPS = (
    'snippets',
    'rest_framework',
    ...
)
```

We can now run the site:

    > ./manage.py runserver

And point our browser at (http://localhost:8000/) and see the list of available url endpoints:

``` python
^api-auth/ ^login/$ [name='login']
^api-auth/ ^logout/$ [name='logout']
^ ^snippets/$ [name='create']
^ ^snippets\.(?P<format>[a-z0-9]+)/?$ [name='create']
^ ^snippets/(?P<uuid>.{36})/$ [name='detail']
^ ^snippets/(?P<uuid>.{36})\.(?P<format>[a-z0-9]+)/?$ [name='detail']
```

You should be able to visit (http://localhost:8000/snippets) and use the form rendered by the REST framework's Browseable API to create a few snippets, then visit (http://localhost:8000/snippets/) to view them.

Time for another beer!!

# Authentication & Authorisation

Let's add an owner to the snippets using Django's built-in user authentication and authorisation model in `backend/snippets/models.py`:

``` python
class Snippet(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey('auth.User', related_name='snippets')
    content = JSONField()
    created = models.DateTimeField(default=timezone.now)
```

and in `backend/snippets/serializers.py`:

``` python
from rest_framework import serializers

from django.contrib.auth.models import User

from .models import Snippet

class SnippetSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Snippet
        fields = (
            'uuid',
            'owner',
            'content',
            'results',
            )
        read_only_fields = (
            'uuid',
            'created',
            )

class UserSerializer(serializers.ModelSerializer):
    snippets = serializers.PrimaryKeyRelatedField(many=True, queryset=Snippet.objects.all())

    class Meta:
        model = User
        fields = ('id', 'username', 'snippets')
```

And add the views which handle CRUD for own owner users in `/backend/snippets/serializers.py`:

``` python
from rest_framework.generics import *
from rest_framework.permissions import IsAuthenticated

from django.contrib.auth.models import User

from snippets.models import Snippet
from snippets.serializers import (SnippetSerializer, UserSerializer)

class SnippetCreate(ListCreateAPIView):
#    permission_classes = (IsAuthenticated, )
    queryset = Snippet.objects.all()
    serializer_class = SnippetSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class SnippetDetail(RetrieveUpdateDestroyAPIView):
#    permission_classes = (IsAuthenticated, )
    queryset = Snippet.objects.all()
    serializer_class = SnippetSerializer
    lookup_field = 'uuid'


class UserCreate(ListCreateAPIView):
#    permission_classes = (IsAuthenticated, )
    queryset = User.objects.all()
    serializer_class = UserSerializer


class UserDetail(RetrieveUpdateAPIView):
#    permission_classes = (IsAuthenticated, )
    queryset = User.objects.all()
    serializer_class = UserSerializer


snippet_create = SnippetCreate.as_view()
snippet_detail = SnippetDetail.as_view()

user_create = UserCreate.as_view()
user_detail = UserDetail.as_view()

```

Then tell Django how to get to those endpoints in `backend/snippets/urls.py`:

``` python
from django.conf.urls import url
from rest_framework.urlpatterns import format_suffix_patterns
from .views import snippet_create, snippet_detail, user_create, user_detail

urlpatterns = [
    url(r'^snippets/$', snippet_create, name="create"),
    url(r'^snippets/(?P<uuid>.{36})/$', snippet_detail, name="detail"),
    url(r'^users/$', user_create, name="create_user"),
    url(r'^users/(?P<pk>[0-9]+)/$', user_detail, name="detail_user"),
]
urlpatterns = format_suffix_patterns(urlpatterns)
```

We can also now expose the JWT token endpoints in `backend/authtest/urls.py`

``` python

urlpatterns = []

urlpatterns += patterns('rest_framework_jwt.views',
    # token login/logout
    url(r'^token/obtain/$', 'obtain_jwt_token'),
    url(r'^token/refresh/$', 'refresh_jwt_token'),
    url(r'^token/verify/$', 'verify_jwt_token'),
)

```

Now, let's set the default permissions require authentication in `backend\authtest\settings.py`:

``` python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework_jwt.authentication.JSONWebTokenAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
       'rest_framework.permissions.IsAuthenticated',
    ),
}
```

You can then migrate the new model into the database:

    > ./manage.py makemigrations
    > ./manage.py migrate

You can then make the following call

    > curl -X POST -d "username=username&password=password" "http://localhost:8000/token/obtain/"

Which returns the following token as JSON:

    {"token":"xxXxxXxxXxXXXxXNXxXxXxXNxXXNXxxXXXXN.xxXNxNXxxxXxXXXNXxXNxXxxxXNxXXXxxxxxXNxxxXXNXXXNXxxNXXxNXXxxxXXxxxNxXXXNXXxxXXNxxXxxXxXxXXNXXXXNxXxxxNXxxxXNxxXxXxXxxXXxXxXNxXXNXXXNXxxNXXXNXXN.xNXxNNxNXXxxNxXxXXxXxxx-xXXxXXXx_xxxXxXxNNx"}

Which you can then post back to the API:

    > curl -X GET "http://localhost:8000/users/" -H "Authorization: JWT jwt-token-here"

And it will return you a list of users.  W00+!

Time for another beer!!

