from django.urls import path
from .views import (
    ProductListView, ProductDetailView, TrendingProductsView,
    ShoeFinderView, SizeAdvisorView,
    RegisterView, LoginView, LogoutView, MeView, MemberProfileView,
    ProductReviewsView, WishlistView,
    CartView, AddToCartView, CartItemDetailView, ClearCartView,
    OrderListView, CheckoutView, NewsletterView,
)

urlpatterns = [
    # Products
    path('products/', ProductListView.as_view(), name='product-list'),
    path('products/trending/', TrendingProductsView.as_view(), name='trending'),
    path('products/<int:id>/', ProductDetailView.as_view(), name='product-detail'),
    path('products/<int:product_id>/reviews/', ProductReviewsView.as_view(), name='product-reviews'),

    # AI Features
    path('shoe-finder/', ShoeFinderView.as_view(), name='shoe-finder'),
    path('size-advisor/', SizeAdvisorView.as_view(), name='size-advisor'),

    # Auth & Member
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/me/', MeView.as_view(), name='me'),
    path('member/', MemberProfileView.as_view(), name='member'),

    # Wishlist
    path('wishlist/', WishlistView.as_view(), name='wishlist'),

    # Cart
    path('cart/', CartView.as_view(), name='cart'),
    path('cart/add/', AddToCartView.as_view(), name='add-to-cart'),
    path('cart/items/<int:item_id>/', CartItemDetailView.as_view(), name='cart-item-detail'),
    path('cart/clear/', ClearCartView.as_view(), name='clear-cart'),

    # Orders
    path('orders/', OrderListView.as_view(), name='order-list'),
    path('checkout/', CheckoutView.as_view(), name='checkout'),

    # Newsletter
    path('newsletter/', NewsletterView.as_view(), name='newsletter'),
]
