from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Initialize the DefaultRouter
router = DefaultRouter()

# Register ViewSets with the router
router.register(r'products', views.ProductViewSet, basename='product')
# If you have other ViewSets, register them here:
# router.register(r'other-model', views.OtherViewSet, basename='other')

# URL patterns that use APIView classes directly
urlpatterns = [
    # Cart endpoints
    path('cart/', views.CartDetail.as_view(), name='cart-detail'),
    
    # Checkout endpoint
    path('checkout/', views.CheckoutView.as_view(), name='checkout'),
    
    # M-Pesa callback endpoint
    path('mpesa-callback/', views.mpesa_callback, name='mpesa-callback'),
    
    # Order endpoints
    path('orders/', views.OrderList.as_view(), name='order-list'),
    
    # Include API documentation URLs if using drf-yasg or similar
    # path('docs/', include_docs_urls(title='Your API Docs')),
    
    # Include router URLs last
] + router.urls