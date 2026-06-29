from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from store.models import Product, Review, MemberProfile


SAMPLE_REVIEWS = [
    (5, "Absolutely love these! Perfect fit and super comfortable for all-day wear."),
    (4, "Great quality and style. Took a few days to break in but worth it."),
    (5, "Best purchase I've made this year. True to size and looks even better in person."),
    (4, "Solid performance shoe. Good cushioning and responsive feel."),
    (3, "Decent shoe but runs slightly narrow. Size up if you have wide feet."),
    (5, "Incredible comfort and the design is fire. Gets compliments everywhere."),
]


class Command(BaseCommand):
    help = 'Seed sample reviews for products'

    def handle(self, *args, **options):
        if Review.objects.exists():
            self.stdout.write('Reviews already exist. Skipping.')
            return

        users = list(User.objects.all())
        if not users:
            self.stdout.write('No users found. Register a user first or run after tests.')
            return

        count = 0
        for i, product in enumerate(Product.objects.all()):
            user = users[i % len(users)]
            rating, comment = SAMPLE_REVIEWS[i % len(SAMPLE_REVIEWS)]
            Review.objects.create(product=product, user=user, rating=rating, comment=comment)
            count += 1

        self.stdout.write(self.style.SUCCESS(f'Seeded {count} reviews.'))
