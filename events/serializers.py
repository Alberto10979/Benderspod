from rest_framework import serializers
from .models import Event
from django.conf import settings

class EventSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Event
        fields = ['id', 'title', 'description', 'location', 'image_url']
    
    def get_image_url(self, obj):
        if obj.image:
            try:
                # This will work with Cloudinary
                return obj.image.url
            except:
                # Fallback if image doesn't exist
                return None
        return None