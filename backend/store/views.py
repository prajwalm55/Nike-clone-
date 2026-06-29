from django.contrib.auth import authenticate
from django.db.models import Q
from rest_framework import generics, status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Product, Cart, CartItem
from .serializers import (
    ProductSerializer, RegisterSerializer, UserSerializer,
    CartSerializer, AddToCartSerializer, UpdateCartItemSerializer,
)


# ----------------------------- Products -----------------------------

class ProductListView(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        qs = Product.objects.all()
        category = self.request.query_params.get('category')
        gender = self.request.query_params.get('gender')
        search = self.request.query_params.get('search')
        featured = self.request.query_params.get('featured')
        new = self.request.query_params.get('new')

        if category:
            qs = qs.filter(category__iexact=category)
        if gender:
            qs = qs.filter(gender__iexact=gender)
        if featured and featured.lower() == 'true':
            qs = qs.filter(is_featured=True)
        if new and new.lower() == 'true':
            qs = qs.filter(is_new=True)
        if search:
            qs = qs.filter(
                Q(name__icontains=search) |
                Q(subtitle__icontains=search) |
                Q(category__icontains=search)
            )
        return qs


class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'id'


# ----------------------------- Auth -----------------------------

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'user': UserSerializer(user).data,
            'token': token.key,
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        # Allow login with email too
        email = request.data.get('email')
        if not username and email:
            try:
                from django.contrib.auth.models import User
                username = User.objects.get(email__iexact=email).username
            except User.DoesNotExist:
                username = None

        user = authenticate(request, username=username, password=password)
        if user is None:
            return Response(
                {'detail': 'Invalid credentials.'},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'user': UserSerializer(user).data,
            'token': token.key,
        })


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        Token.objects.filter(user=request.user).delete()
        return Response({'detail': 'Logged out.'}, status=status.HTTP_200_OK)


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)


# ----------------------------- Cart -----------------------------

def get_or_create_cart(request):
    """Get a cart for an authenticated user, or by anonymous session key."""
    if request.user.is_authenticated:
        cart, _ = Cart.objects.get_or_create(user=request.user)
        return cart
    session_key = request.headers.get('X-Session-Key') or request.query_params.get('session_key')
    if not session_key:
        return None
    cart, _ = Cart.objects.get_or_create(session_key=session_key)
    return cart


class CartView(APIView):
    def get(self, request):
        cart = get_or_create_cart(request)
        if cart is None:
            return Response(
                {'detail': 'Provide an X-Session-Key header for anonymous carts.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(CartSerializer(cart).data)


class AddToCartView(APIView):
    def post(self, request):
        cart = get_or_create_cart(request)
        if cart is None:
            return Response(
                {'detail': 'Provide an X-Session-Key header for anonymous carts.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        serializer = AddToCartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            product = Product.objects.get(id=serializer.validated_data['product_id'])
        except Product.DoesNotExist:
            return Response({'detail': 'Product not found.'}, status=status.HTTP_404_NOT_FOUND)

        qty = serializer.validated_data['quantity']
        size = serializer.validated_data['size']
        item, created = CartItem.objects.get_or_create(
            cart=cart, product=product, size=size,
            defaults={'quantity': qty},
        )
        if not created:
            item.quantity += qty
            item.save()
        return Response(CartSerializer(cart).data, status=status.HTTP_200_OK)


class CartItemDetailView(APIView):
    def patch(self, request, item_id):
        cart = get_or_create_cart(request)
        if cart is None:
            return Response({'detail': 'No cart.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            item = CartItem.objects.get(id=item_id, cart=cart)
        except CartItem.DoesNotExist:
            return Response({'detail': 'Item not found.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = UpdateCartItemSerializer(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        if 'quantity' in serializer.validated_data:
            item.quantity = serializer.validated_data['quantity']
        if 'size' in serializer.validated_data:
            item.size = serializer.validated_data['size']
        item.save()
        return Response(CartSerializer(cart).data)

    def delete(self, request, item_id):
        cart = get_or_create_cart(request)
        if cart is None:
            return Response({'detail': 'No cart.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            item = CartItem.objects.get(id=item_id, cart=cart)
        except CartItem.DoesNotExist:
            return Response({'detail': 'Item not found.'}, status=status.HTTP_404_NOT_FOUND)
        item.delete()
        return Response(CartSerializer(cart).data, status=status.HTTP_200_OK)


class ClearCartView(APIView):
    def delete(self, request):
        cart = get_or_create_cart(request)
        if cart is None:
            return Response({'detail': 'No cart.'}, status=status.HTTP_400_BAD_REQUEST)
        cart.items.all().delete()
        return Response(CartSerializer(cart).data, status=status.HTTP_200_OK)
