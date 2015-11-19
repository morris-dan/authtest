import uuid
from django.utils import timezone

from django.db import models
from django_extensions.db.fields.json import JSONField

class Snippet(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey('auth.User', related_name='snippets')
    content = JSONField()
    created = models.DateTimeField(default=timezone.now)

    @property
    def results(self):
        results = {"alpha": 123.678}
        return results
