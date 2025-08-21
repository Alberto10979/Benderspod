from django.shortcuts import render

# Create your views here.
from django.db.models import Sum
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import Fixture, Player, Prediction
from .serializers import FixtureSerializer, PlayerSerializer, PredictionSerializer, LeaderboardSerializer


class FixtureListAPIView(generics.ListAPIView):
    queryset = Fixture.objects.select_related('home_team', 'away_team')
    serializer_class = FixtureSerializer


class FixturePlayersAPIView(APIView):
    def get(self, request, pk):
        fixture = get_object_or_404(Fixture, pk=pk)
        players = Player.objects.filter(team__in=[fixture.home_team_id, fixture.away_team_id])
        return Response(PlayerSerializer(players, many=True).data)


class SubmitPredictionAPIView(generics.CreateAPIView):
    queryset = Prediction.objects.all()
    serializer_class = PredictionSerializer


class LeaderboardAPIView(APIView):
    """
    GET /api/leaderboard
    """
    def get(self, request):
        leaderboard = (
            Prediction.objects.values('username')
            .annotate(total_points=Sum('points'))
            .order_by('-total_points')
        )
        return Response(leaderboard)

