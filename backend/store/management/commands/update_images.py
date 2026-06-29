from django.core.management.base import BaseCommand
from store.models import Product
from store.management.commands.seed_products import PRODUCTS


class Command(BaseCommand):
    help = 'Update product image URLs in the database'

    def handle(self, *args, **options):
        updated = 0
        for data in PRODUCTS:
            try:
                product = Product.objects.get(name=data['name'])
                product.image_url = data['image_url']
                product.image_url_2 = data['image_url_2']
                product.save(update_fields=['image_url', 'image_url_2'])
                updated += 1
            except Product.DoesNotExist:
                self.stdout.write(self.style.WARNING(f"Not found: {data['name']}"))

        self.stdout.write(self.style.SUCCESS(f'Updated images for {updated} products.'))
