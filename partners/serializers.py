from rest_framework import serializers
from .models import Partner

# serializers.py
class PartnerSerializer(serializers.ModelSerializer):
    logo_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Partner
        fields = ['id', 'name', 'description', 'logo_url', 'website', 'partner_type', 'is_active', 'created_at']
    
    def get_logo_url(self, obj):
        if obj.logo:
            try:
                # For Cloudinary, the URL is already absolute
                return obj.logo.url
            except:
                # Fallback to building absolute URL if needed
                request = self.context.get('request')
                if request:
                    return request.build_absolute_uri(obj.logo.url)
                return obj.logo.url
        return None