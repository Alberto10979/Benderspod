from django.urls import path
from .views import AllEventsAPIView, UpcomingEventsAPIView, EventDetailAPIView

urlpatterns = [
    path('events/all/', AllEventsAPIView.as_view(), name='all-events'),
    path('events/upcoming/', UpcomingEventsAPIView.as_view(), name='upcoming-events'),
    path('events/<int:pk>/', EventDetailAPIView.as_view(), name='event-detail'),
]