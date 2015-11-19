from rest_framework.generics import (CreateAPIView, ListCreateAPIView, RetrieveUpdateAPIView, RetrieveUpdateDestroyAPIView)

from django.contrib.auth.models import User

from snippets.models import Snippet
from snippets.serializers import (SnippetSerializer, UserSerializer)


class SnippetCreate(CreateAPIView):
    queryset = Snippet.objects.all()
    serializer_class = SnippetSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class SnippetDetail(RetrieveUpdateDestroyAPIView):
    queryset = Snippet.objects.all()
    serializer_class = SnippetSerializer
    lookup_field = 'uuid'


class UserCreate(ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class UserDetail(RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


snippet_create = SnippetCreate.as_view()
snippet_detail = SnippetDetail.as_view()

user_create = UserCreate.as_view()
user_detail = UserDetail.as_view()
