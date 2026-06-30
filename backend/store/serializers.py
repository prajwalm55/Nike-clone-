from django.contrib.auth.models import User
from rest_framework import serializers

from .models import (
    Product, Cart, CartItem, Review, WishlistItem, MemberProfile,
    Order, OrderItem, NewsletterSubscriber,
)


class ProductSerializer(serializers.ModelSerializer):
    average_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()
    effective_price = serializers.SerializerMethodField()
    discount_percent = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = '__all__'

    def get_average_rating(self, obj):
        return obj.average_rating

    def get_review_count(self, obj):
        return obj.review_count

    def get_effective_price(self, obj):
        return str(obj.effective_price)

    def get_discount_percent(self, obj):
        return obj.discount_percent


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class MemberProfileSerializer(serializers.ModelSerializer):
    next_tier_points = serializers.ReadOnlyField()

    class Meta:
        model = MemberProfile
        fields = ['points', 'tier', 'shoes_owned', 'next_tier_points']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'first_name', 'last_name']

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class ReviewSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'product', 'username', 'rating', 'comment', 'created_at']
        read_only_fields = ['product', 'username', 'created_at']


class CreateReviewSerializer(serializers.Serializer):
    rating = serializers.IntegerField(min_value=1, max_value=5)
    comment = serializers.CharField(max_length=1000)


class WishlistItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = WishlistItem
        fields = ['id', 'product', 'created_at']


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    subtotal = serializers.ReadOnlyField()

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'quantity', 'size', 'subtotal']


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_price = serializers.ReadOnlyField()
    total_items = serializers.ReadOnlyField()

    class Meta:
        model = Cart
        fields = ['id', 'items', 'total_price', 'total_items', 'created_at', 'updated_at']


class AddToCartSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1, default=1)
    size = serializers.CharField(max_length=20, default='M')


class UpdateCartItemSerializer(serializers.Serializer):
    quantity = serializers.IntegerField(min_value=1)
    size = serializers.CharField(max_length=20, required=False)


class ShoeFinderSerializer(serializers.Serializer):
    activity = serializers.ChoiceField(choices=['running', 'training', 'lifestyle', 'racing'])
    surface = serializers.ChoiceField(choices=['road', 'trail', 'gym', 'court'])
    gender = serializers.ChoiceField(choices=['men', 'women', 'unisex', 'kids'])
    experience = serializers.ChoiceField(choices=['beginner', 'intermediate', 'advanced'])
    budget = serializers.ChoiceField(choices=['under150', '150to200', 'over200'])


class SizeAdvisorSerializer(serializers.Serializer):
    brand = serializers.ChoiceField(choices=['nike', 'adidas', 'new_balance', 'puma'])
    current_size = serializers.CharField(max_length=10)
    product_id = serializers.IntegerField()


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'product_name', 'quantity', 'size', 'price']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'total', 'status', 'tracking_number', 'items', 'created_at']


class NewsletterSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def create(self, validated_data):
        obj, _ = NewsletterSubscriber.objects.get_or_create(email=validated_data['email'])
        return obj
