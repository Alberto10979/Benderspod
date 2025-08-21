from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Team, Player, Fixture, Prediction

admin.site.register(Team)
admin.site.register(Player)
admin.site.register(Prediction)

@admin.register(Fixture)
class FixtureAdmin(admin.ModelAdmin):
    list_display = ('home_team', 'away_team', 'kickoff_at', 'is_open', 'home_score', 'away_score', 'man_of_the_match')
    list_filter = ('is_open',)
    autocomplete_fields = ('home_team', 'away_team', 'man_of_the_match')

