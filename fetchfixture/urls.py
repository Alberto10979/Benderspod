from django.urls import path
from . import views

urlpatterns = [
    path('fixtures/upcoming/', views.upcoming_matches, name='upcoming_fixtures'),
]