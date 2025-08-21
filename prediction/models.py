from django.db import models

class Team(models.Model):
    name = models.CharField(max_length=100, unique=True)
    logo_url = models.URLField(blank=True)

    def __str__(self):
        return self.name


class Player(models.Model):
    name = models.CharField(max_length=120)
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='players')

    class Meta:
        unique_together = ('name', 'team')

    def __str__(self):
        return f"{self.name} ({self.team.name})"


class Fixture(models.Model):
    home_team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='home_fixtures')
    away_team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='away_fixtures')
    kickoff_at = models.DateTimeField()
    is_open = models.BooleanField(default=True)

    # Results (filled in by admin after match ends)
    home_score = models.PositiveIntegerField(null=True, blank=True)
    away_score = models.PositiveIntegerField(null=True, blank=True)
    man_of_the_match = models.ForeignKey(Player, null=True, blank=True, on_delete=models.SET_NULL)

    def __str__(self):
        return f"{self.home_team.name} vs {self.away_team.name} @ {self.kickoff_at}"


class Prediction(models.Model):
    username = models.CharField(max_length=120)
    fixture = models.ForeignKey(Fixture, on_delete=models.CASCADE, related_name='predictions')
    home_score = models.PositiveIntegerField()
    away_score = models.PositiveIntegerField()
    man_of_the_match = models.ForeignKey(Player, on_delete=models.PROTECT, related_name='motm_predictions')
    created_at = models.DateTimeField(auto_now_add=True)

    points = models.IntegerField(default=0)

    class Meta:
        unique_together = ('username', 'fixture')
        ordering = ['-created_at']

    def calculate_points(self):
        """Award points once fixture has results."""
        if self.fixture.home_score is None or self.fixture.away_score is None or not self.fixture.man_of_the_match:
            return 0  # Match not decided

        pts = 0
        # Check result W/D/L
        actual_diff = self.fixture.home_score - self.fixture.away_score
        predicted_diff = self.home_score - self.away_score

        if (actual_diff > 0 and predicted_diff > 0) or \
           (actual_diff == 0 and predicted_diff == 0) or \
           (actual_diff < 0 and predicted_diff < 0):
            pts += 3

        # Exact score
        if self.fixture.home_score == self.home_score and self.fixture.away_score == self.away_score:
            pts += 2

        # Correct MOTM
        if self.fixture.man_of_the_match_id == self.man_of_the_match_id:
            pts += 5

        return pts

