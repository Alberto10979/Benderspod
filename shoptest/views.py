import json
import logging
import base64
import requests
from datetime import datetime
from django.db.models import Q
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response
from .models import Product, Cart, CartItem, Order
from .serializers import ProductSerializer, CartSerializer, OrderSerializer

# Initialize logger
logger = logging.getLogger(__name__)

# M-Pesa Configuration
MPESA_CONFIG = {
    'SHORTCODE': "174379",  # Sandbox test code
    'PASSKEY': "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919",
    'CONSUMER_KEY': "1vU4ulC5QIbpWdysbpa5r51zI0uWLjf4nfVmOWHee4ZOuWhX",
    'CONSUMER_SECRET': "OrTn7kDEKXc2Lv4ISTuAB2LaB15chEs1sCS5bIFyJpAqtw9uUIBXSid1zBDzq7gc",
    'CALLBACK_URL': "https://localhost:8000/api/mpesa-callback/",
    'AUTH_URL': "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    'STK_PUSH_URL': "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
}

class ProductViewSet(viewsets.ModelViewSet):
    """Handles product CRUD operations"""
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_serializer_context(self):
        return {'request': self.request}

class CartDetail(generics.RetrieveUpdateAPIView):
    """Handles cart operations"""
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        cart, created = Cart.objects.get_or_create(user=self.request.user)
        return cart
    
    def get_serializer_context(self):
        return {'request': self.request}

class OrderList(generics.ListAPIView):
    """Lists user's orders"""
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('-created_at')

class CheckoutView(generics.CreateAPIView):
    """Handles checkout and payment initiation"""
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        try:
            cart = Cart.objects.get(user=request.user)
            if not cart.items.exists():
                return Response(
                    {"error": "Your cart is empty"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            phone = request.data.get('phone')
            if not self._validate_phone(phone):
                return Response(
                    {"error": "Invalid phone number format. Use 2547XXXXXXXX"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            amount = sum(item.total_price() for item in cart.items.all())
            access_token = self._get_mpesa_access_token()
            
            if not access_token:
                return Response(
                    {"error": "Payment service unavailable"},
                    status=status.HTTP_503_SERVICE_UNAVAILABLE
                )

            response = self._initiate_stk_push(access_token, phone, amount)
            if response.status_code != 200:
                return Response(
                    {"error": "Payment initiation failed"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            response_data = response.json()
            if response_data.get('ResponseCode') == '0':
                return self._handle_successful_payment_initiation(
                    request.user, cart, amount, phone, response_data
                )
            else:
                return self._handle_failed_payment_initiation(response_data)

        except Cart.DoesNotExist:
            return Response({"error": "Cart not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Checkout error: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def _validate_phone(self, phone):
        return phone and len(phone) == 12 and phone.startswith('254')

    def _get_mpesa_access_token(self):
        try:
            response = requests.get(
                MPESA_CONFIG['AUTH_URL'],
                auth=(MPESA_CONFIG['CONSUMER_KEY'], MPESA_CONFIG['CONSUMER_SECRET']),
                timeout=10
            )
            return response.json().get('access_token') if response.status_code == 200 else None
        except requests.RequestException as e:
            logger.error(f"MPesa auth failed: {str(e)}")
            return None

    def _initiate_stk_push(self, access_token, phone, amount):
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        password = base64.b64encode(
            f"{MPESA_CONFIG['SHORTCODE']}{MPESA_CONFIG['PASSKEY']}{timestamp}".encode()
        ).decode()
        
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "BusinessShortCode": MPESA_CONFIG['SHORTCODE'],
            "Password": password,
            "Timestamp": timestamp,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": str(int(amount)),
            "PartyA": phone,
            "PartyB": MPESA_CONFIG['SHORTCODE'],
            "PhoneNumber": phone,
            "CallBackURL": MPESA_CONFIG['CALLBACK_URL'],
            "AccountReference": f"ORDER-{datetime.now().strftime('%Y%m%d%H%M%S')}",
            "TransactionDesc": "Online Store Purchase"
        }

        return requests.post(
            MPESA_CONFIG['STK_PUSH_URL'],
            headers=headers,
            json=payload,
            timeout=30
        )

    def _handle_successful_payment_initiation(self, user, cart, amount, phone, response_data):
        order = Order.objects.create(
            user=user,
            total_amount=amount,
            phone=phone,
            merchant_request_id=response_data.get('MerchantRequestID'),
            checkout_request_id=response_data.get('CheckoutRequestID'),
            status='pending'
        )
        order.items.set(cart.items.all())
        cart.items.all().delete()
        
        return Response({
            "status": "success",
            "message": "Payment initiated. Complete payment on your phone.",
            "data": {
                "order_id": order.id,
                "amount": amount,
                "mpesa_response": response_data
            }
        })

    def _handle_failed_payment_initiation(self, response_data):
        error_message = response_data.get('errorMessage', 'Payment initiation failed')
        logger.error(f"STK push failed: {error_message}")
        return Response({
            "status": "error",
            "message": error_message,
            "data": response_data
        }, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt
def mpesa_callback(request):
    """Handles MPesa payment callback"""
    if request.method != 'POST':
        return JsonResponse(
            {"status": "error", "message": "Method not allowed"},
            status=405
        )

    try:
        data = json.loads(request.body.decode('utf-8'))
        callback = data.get('Body', {}).get('stkCallback', {})
        
        if not callback:
            logger.error("Invalid callback format")
            return JsonResponse(
                {"status": "error", "message": "Invalid callback format"},
                status=400
            )
        
        merchant_id = callback.get('MerchantRequestID')
        checkout_id = callback.get('CheckoutRequestID')
        result_code = callback.get('ResultCode')
        result_desc = callback.get('ResultDesc', 'No description')

        if not (merchant_id or checkout_id):
            logger.error("Missing reference IDs")
            return JsonResponse(
                {"status": "error", "message": "Missing reference IDs"},
                status=400
            )

        try:
            order = Order.objects.get(
                Q(merchant_request_id=merchant_id) | Q(checkout_request_id=checkout_id)
            )
            
            if result_code == '0':
                return _handle_successful_payment(order, callback)
            else:
                return _handle_failed_payment(order, result_desc)
                
        except Order.DoesNotExist:
            logger.error(f"Order not found for IDs: {merchant_id}, {checkout_id}")
            return JsonResponse(
                {"status": "error", "message": "Order not found"},
                status=404
            )
            
    except json.JSONDecodeError:
        logger.error("Invalid JSON in callback")
        return JsonResponse(
            {"status": "error", "message": "Invalid JSON data"},
            status=400
        )
    except Exception as e:
        logger.error(f"Callback processing error: {str(e)}")
        return JsonResponse(
            {"status": "error", "message": "Internal server error"},
            status=500
        )

def _handle_successful_payment(order, callback):
    """Process successful payment callback"""
    metadata = {item.get('Name'): item.get('Value') 
               for item in callback.get('CallbackMetadata', {}).get('Item', [])}
    
    order.mpesa_code = metadata.get('MpesaReceiptNumber')
    order.status = 'completed'
    order.payment_amount = metadata.get('Amount')
    order.payment_date = datetime.now()
    order.save()
    
    logger.info(f"Order {order.id} payment completed")
    
    # TODO: Trigger order fulfillment processes
    
    return JsonResponse({
        "status": "success",
        "message": "Payment processed",
        "order_id": order.id,
        "mpesa_receipt": order.mpesa_code
    })

def _handle_failed_payment(order, error_message):
    """Process failed payment callback"""
    order.status = 'failed'
    order.payment_error = error_message
    order.save()
    
    logger.warning(f"Order {order.id} payment failed: {error_message}")
    
    return JsonResponse({
        "status": "failed",
        "message": error_message,
        "order_id": order.id
    })