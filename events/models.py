from django.db import models
from django.utils import timezone
from django.core.validators import MinValueValidator

class Event(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    date = models.DateTimeField(
        validators=[MinValueValidator(timezone.now())]
    )
    location = models.CharField(max_length=200)
    image = models.ImageField(upload_to='events/')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['date']

# Create your models here.
