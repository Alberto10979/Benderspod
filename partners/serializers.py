from rest_framework import serializers
from .models import Partner

class PartnerSerializer(serializers.ModelSerializer):
    logo_url = serializers.SerializerMethodField()

    class Meta:
        model = Partner
        fields = [
            'id',
            'name',
            'description',
            'logo_url',
            'website',
            'partner_type',
            'is_active',
            'created_at',
        ]

    def get_logo_url(self, obj):
        """
        Returns a full URL for the partner logo.
        - If using Cloudinary: obj.logo.url is already absolute.
        - If using local storage: build_absolute_uri() will make it absolute.
        """
        if obj.logo:
            url = obj.logo.url
            if url.startswith("http"):  # Cloudinary or external storage
                return url
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(url)
            return url
        return None
