from rest_framework import serializers
from snippets.models import Snippet

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
