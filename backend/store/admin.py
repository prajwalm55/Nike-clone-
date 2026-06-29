from django.contrib import admin
from .models import Product, Cart, CartItem


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'gender', 'price', 'is_featured', 'is_new']
    list_filter = ['category', 'gender', 'is_featured', 'is_new']
    search_fields = ['name', 'subtitle', 'category']


class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'session_key', 'total_items', 'created_at']
    inlines = [CartItemInline]
