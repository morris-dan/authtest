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
