from rest_framework import serializers
from .models import Event
from django.conf import settings

class EventSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    
    class Meta:
        model = Event
        fields = ['id', 'title', 'description', 'date', 
                 'location', 'image', 'created_at', 'is_active']
    
    def get_image(self, obj):
        if obj.image:
            return self.context['request'].build_absolute_uri(obj.image.url)
        return None