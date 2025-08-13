from rest_framework import generics
from .models import Event
from .serializers import EventSerializer
from django.utils import timezone
from rest_framework.permissions import AllowAny

class AllEventsAPIView(generics.ListAPIView):
    """
    Get all active events (both upcoming and past)
    """
    serializer_class = EventSerializer
    permission_classes = [AllowAny]
    queryset = Event.objects.filter(is_active=True).order_by('date')
    
    def get_serializer_context(self):
        return {'request': self.request}

class UpcomingEventsAPIView(generics.ListAPIView):
    """
    Get only upcoming active events (original functionality)
    """
    serializer_class = EventSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        return Event.objects.filter(
            date__gte=timezone.now(),
            is_active=True
        ).order_by('date')
    
    def get_serializer_context(self):
        return {'request': self.request}

class EventDetailAPIView(generics.RetrieveAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [AllowAny]
    
    def get_serializer_context(self):
        return {'request': self.request}