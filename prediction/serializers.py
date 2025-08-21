from rest_framework import serializers
from .models import Team, Player, Fixture, Prediction

class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = ['id', 'name', 'logo_url']


class PlayerSerializer(serializers.ModelSerializer):
    team = TeamSerializer(read_only=True)

    class Meta:
        model = Player
        fields = ['id', 'name', 'team']


class FixtureSerializer(serializers.ModelSerializer):
    home_team = TeamSerializer(read_only=True)
    away_team = TeamSerializer(read_only=True)

    class Meta:
        model = Fixture
        fields = [
            'id', 'home_team', 'away_team', 'kickoff_at',
            'is_open', 'home_score', 'away_score', 'man_of_the_match'
        ]


class PredictionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prediction
        fields = [
            'id', 'username', 'fixture', 'home_score',
            'away_score', 'man_of_the_match', 'points', 'created_at'
        ]


class LeaderboardSerializer(serializers.Serializer):
    username = serializers.CharField()
    total_points = serializers.IntegerField()
