from django.urls import path
from .views import (
    ProductListView, ProductDetailView,
    RegisterView, LoginView, LogoutView, MeView,
    CartView, AddToCartView, CartItemDetailView, ClearCartView,
)

urlpatterns = [
    # Products
    path('products/', ProductListView.as_view(), name='product-list'),
    path('products/<int:id>/', ProductDetailView.as_view(), name='product-detail'),

    # Auth
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/me/', MeView.as_view(), name='me'),

    # Cart
    path('cart/', CartView.as_view(), name='cart'),
    path('cart/add/', AddToCartView.as_view(), name='add-to-cart'),
    path('cart/items/<int:item_id>/', CartItemDetailView.as_view(), name='cart-item-detail'),
    path('cart/clear/', ClearCartView.as_view(), name='clear-cart'),
]
