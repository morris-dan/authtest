from rest_framework.generics import CreateAPIView, RetrieveUpdateDestroyAPIView

from snippets.models import Snippet
from snippets.serializers import SnippetSerializer


class SnippetCreate(CreateAPIView):
    queryset = Snippet.objects.all()
    serializer_class = SnippetSerializer

class SnippetDetail(RetrieveUpdateDestroyAPIView):
    queryset = Snippet.objects.all()
    serializer_class = SnippetSerializer
    lookup_field = 'uuid'


snippet_create = SnippetCreate.as_view()
snippet_detail = SnippetDetail.as_view()
