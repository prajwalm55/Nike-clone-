from django.conf import settings
from django.db import models


class Product(models.Model):
    GENDER_CHOICES = [
        ('men', 'Men'),
        ('women', 'Women'),
        ('unisex', 'Unisex'),
    ]

    name = models.CharField(max_length=200)
    subtitle = models.CharField(max_length=200, blank=True)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=100, default='Lifestyle')
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES, default='unisex')
    color = models.CharField(max_length=80, blank=True)
    image_url = models.URLField(max_length=500, blank=True)
    image_url_2 = models.URLField(max_length=500, blank=True)
    sizes = models.JSONField(default=list, blank=True)
    is_featured = models.BooleanField(default=False)
    is_new = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name

    @property
    def formatted_price(self):
        return f"${self.price:,.0f}"

    @property
    def average_rating(self):
        reviews = self.reviews.all()
        if not reviews:
            return 0
        return round(sum(r.rating for r in reviews) / len(reviews), 1)

    @property
    def review_count(self):
        return self.reviews.count()


class Review(models.Model):
    product = models.ForeignKey(Product, related_name='reviews', on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    rating = models.PositiveSmallIntegerField()
    comment = models.TextField(max_length=1000)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('product', 'user')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} — {self.product.name} ({self.rating}★)"


class WishlistItem(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='wishlist', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'product')
        ordering = ['-created_at']


class MemberProfile(models.Model):
    TIER_CHOICES = [
        ('member', 'Member'),
        ('gold', 'Gold'),
        ('platinum', 'Platinum'),
    ]
    user = models.OneToOneField(settings.AUTH_USER_MODEL, related_name='member_profile', on_delete=models.CASCADE)
    points = models.PositiveIntegerField(default=100)
    tier = models.CharField(max_length=20, choices=TIER_CHOICES, default='member')
    shoes_owned = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.user.username} — {self.points} pts ({self.tier})"

    def add_points(self, amount):
        self.points += amount
        if self.points >= 5000:
            self.tier = 'platinum'
        elif self.points >= 2000:
            self.tier = 'gold'
        self.save()

    @property
    def next_tier_points(self):
        if self.tier == 'platinum':
            return 0
        if self.tier == 'gold':
            return 5000 - self.points
        return 2000 - self.points


class Cart(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='carts',
        null=True,
        blank=True,
    )
    session_key = models.CharField(max_length=100, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Cart #{self.id} ({self.user or self.session_key})"

    @property
    def total_price(self):
        return sum(item.subtotal for item in self.items.all())

    @property
    def total_items(self):
        return sum(item.quantity for item in self.items.all())


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    size = models.CharField(max_length=20, default='M')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('cart', 'product', 'size')

    def __str__(self):
        return f"{self.quantity} x {self.product.name} (size {self.size})"

    @property
    def subtotal(self):
        return self.product.price * self.quantity
