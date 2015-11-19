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
