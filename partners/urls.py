from django.urls import path
from .views import PartnerListAPIView, PartnerByTypeAPIView

urlpatterns = [
    path('partners/', PartnerListAPIView.as_view(), name='partners-list'),
    path('partners/<str:partner_type>/', PartnerByTypeAPIView.as_view(), name='partners-by-type'),
]