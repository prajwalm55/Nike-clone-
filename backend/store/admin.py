from django.contrib import admin
from .models import Product, Cart, CartItem, Review, WishlistItem, MemberProfile


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'gender', 'price', 'is_featured', 'is_new']
    list_filter = ['category', 'gender', 'is_featured', 'is_new']
    search_fields = ['name', 'subtitle', 'category']


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['product', 'user', 'rating', 'created_at']
    list_filter = ['rating']


@admin.register(WishlistItem)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ['user', 'product', 'created_at']


@admin.register(MemberProfile)
class MemberProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'points', 'tier', 'shoes_owned']


class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'session_key', 'total_items', 'created_at']
    inlines = [CartItemInline]
