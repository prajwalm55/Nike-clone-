from django.contrib.auth import authenticate
from django.db.models import Q, Avg, Count
from rest_framework import generics, status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
import random

from .models import Product, Cart, CartItem, Review, WishlistItem, MemberProfile
from .serializers import (
    ProductSerializer, RegisterSerializer, UserSerializer, MemberProfileSerializer,
    CartSerializer, AddToCartSerializer, UpdateCartItemSerializer,
    ReviewSerializer, CreateReviewSerializer, WishlistItemSerializer,
    ShoeFinderSerializer, SizeAdvisorSerializer,
)
from .services import recommend_shoes, advise_size, get_trending_products


def get_or_create_member(user):
    profile, _ = MemberProfile.objects.get_or_create(user=user)
    return profile


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


class TrendingProductsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        products = get_trending_products()
        data = []
        for p in products:
            item = ProductSerializer(p).data
            item['live_viewers'] = random.randint(8, 47)
            item['trending_score'] = random.randint(70, 99)
            data.append(item)
        return Response(data)


# ----------------------------- Shoe Finder AI -----------------------------

class ShoeFinderView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ShoeFinderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        results = recommend_shoes(serializer.validated_data)
        return Response({
            'matches': ProductSerializer(results, many=True).data,
            'match_reasons': _build_match_reasons(serializer.validated_data, results),
        })


def _build_match_reasons(preferences, products):
    reasons = {}
    activity = preferences['activity']
    for p in products:
        reasons[p.id] = (
            f"Matched for {activity} — {p.category} category with "
            f"{'premium' if float(p.price) > 180 else 'great value'} performance."
        )
    return reasons


# ----------------------------- Size Advisor -----------------------------

class SizeAdvisorView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SizeAdvisorSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            product = Product.objects.get(id=serializer.validated_data['product_id'])
        except Product.DoesNotExist:
            return Response({'detail': 'Product not found.'}, status=status.HTTP_404_NOT_FOUND)
        result = advise_size(
            serializer.validated_data['brand'],
            serializer.validated_data['current_size'],
            product,
        )
        return Response(result)


# ----------------------------- Auth -----------------------------

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        profile = get_or_create_member(user)
        return Response({
            'user': UserSerializer(user).data,
            'token': token.key,
            'member': MemberProfileSerializer(profile).data,
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')
        if not username and email:
            try:
                from django.contrib.auth.models import User
                username = User.objects.get(email__iexact=email).username
            except User.DoesNotExist:
                username = None

        user = authenticate(request, username=username, password=password)
        if user is None:
            return Response({'detail': 'Invalid credentials.'}, status=status.HTTP_401_UNAUTHORIZED)
        token, _ = Token.objects.get_or_create(user=user)
        profile = get_or_create_member(user)
        return Response({
            'user': UserSerializer(user).data,
            'token': token.key,
            'member': MemberProfileSerializer(profile).data,
        })


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        Token.objects.filter(user=request.user).delete()
        return Response({'detail': 'Logged out.'}, status=status.HTTP_200_OK)


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = get_or_create_member(request.user)
        return Response({
            **UserSerializer(request.user).data,
            'member': MemberProfileSerializer(profile).data,
        })


class MemberProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = get_or_create_member(request.user)
        return Response(MemberProfileSerializer(profile).data)


# ----------------------------- Reviews -----------------------------

class ProductReviewsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, product_id):
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        reviews = Review.objects.filter(product=product)
        return Response({
            'reviews': ReviewSerializer(reviews, many=True).data,
            'average_rating': product.average_rating,
            'review_count': product.review_count,
        })

    def post(self, request, product_id):
        if not request.user.is_authenticated:
            return Response({'detail': 'Authentication required.'}, status=status.HTTP_401_UNAUTHORIZED)
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        if Review.objects.filter(product=product, user=request.user).exists():
            return Response({'detail': 'You already reviewed this product.'}, status=status.HTTP_400_BAD_REQUEST)
        serializer = CreateReviewSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        review = Review.objects.create(product=product, user=request.user, **serializer.validated_data)
        profile = get_or_create_member(request.user)
        profile.add_points(25)
        return Response(ReviewSerializer(review).data, status=status.HTTP_201_CREATED)


# ----------------------------- Wishlist -----------------------------

class WishlistView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        items = WishlistItem.objects.filter(user=request.user)
        return Response(WishlistItemSerializer(items, many=True).data)

    def post(self, request):
        product_id = request.data.get('product_id')
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({'detail': 'Product not found.'}, status=status.HTTP_404_NOT_FOUND)
        item, created = WishlistItem.objects.get_or_create(user=request.user, product=product)
        if created:
            profile = get_or_create_member(request.user)
            profile.add_points(5)
        items = WishlistItem.objects.filter(user=request.user)
        return Response(WishlistItemSerializer(items, many=True).data)

    def delete(self, request):
        product_id = request.data.get('product_id')
        WishlistItem.objects.filter(user=request.user, product_id=product_id).delete()
        items = WishlistItem.objects.filter(user=request.user)
        return Response(WishlistItemSerializer(items, many=True).data)


# ----------------------------- Cart -----------------------------

def get_or_create_cart(request):
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
        if request.user.is_authenticated:
            profile = get_or_create_member(request.user)
            profile.add_points(10)
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
        if request.user.is_authenticated:
            profile = get_or_create_member(request.user)
            profile.shoes_owned += cart.total_items
            profile.add_points(cart.total_items * 50)
            profile.save()
        cart.items.all().delete()
        return Response(CartSerializer(cart).data, status=status.HTTP_200_OK)
