from django.shortcuts import render
from rest_framework import generics
from .models import Partner
from .serializers import PartnerSerializer
from rest_framework.permissions import AllowAny

class PartnerListAPIView(generics.ListAPIView):
    """
    Get all active partners
    """
    serializer_class = PartnerSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        return Partner.objects.filter(is_active=True).order_by('name')
    
    def get_serializer_context(self):
        return {'request': self.request}

class PartnerByTypeAPIView(generics.ListAPIView):
    """
    Get partners by specific type
    """
    serializer_class = PartnerSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        partner_type = self.kwargs['partner_type']
        return Partner.objects.filter(
            partner_type=partner_type,
            is_active=True
        ).order_by('name')
    
    def get_serializer_context(self):
        return {'request': self.request}


