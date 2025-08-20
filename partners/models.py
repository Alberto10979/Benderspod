from django.db import models

class Partner(models.Model):
    PARTNER_TYPES = [
        ('sponsor', 'Sponsor'),
        ('media', 'Media Partner'),
        ('community', 'Community Partner'),
        ('technology', 'Technology Partner'),
    ]
    
    name = models.CharField(max_length=200)
    description = models.TextField()
    logo = models.ImageField(upload_to='partners/')
    website = models.URLField(blank=True, null=True)
    partner_type = models.CharField(max_length=20, choices=PARTNER_TYPES, default='sponsor')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['-created_at']



