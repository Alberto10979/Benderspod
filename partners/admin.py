from django.contrib import admin
from .models import Partner 


@admin.register(Partner)
class PartnerAdmin(admin.ModelAdmin):
    list_display = ['name', 'partner_type', 'is_active', 'created_at']
    list_filter = ['partner_type', 'is_active', 'created_at']
    search_fields = ['name', 'description']
    list_editable = ['is_active']



