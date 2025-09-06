from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Fixture, Prediction

@receiver(post_save, sender=Fixture)
def score_predictions(sender, instance, **kwargs):
    # Only score if results are present
    if instance.home_score is not None and instance.away_score is not None and instance.man_of_the_match:
        for prediction in instance.predictions.all():
            prediction.points = prediction.calculate_points()
            prediction.save()
