from django.urls import path
from .views import FixtureListAPIView, FixturePlayersAPIView, SubmitPredictionAPIView, LeaderboardAPIView

urlpatterns = [
    path('fixtures/', FixtureListAPIView.as_view(), name='fixtures-list'),
    path('fixtures/<int:pk>/players/', FixturePlayersAPIView.as_view(), name='fixture-players'),
    path('submitprediction', SubmitPredictionAPIView.as_view(), name='submit-prediction'),
    path('leaderboard', LeaderboardAPIView.as_view(), name='leaderboard'),
]
