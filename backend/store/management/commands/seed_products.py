from django.core.management.base import BaseCommand
from store.models import Product
from store.product_catalog import PRODUCTS


class Command(BaseCommand):
    help = 'Seed the database with Nike product data (first run only)'

    def handle(self, *args, **options):
        if Product.objects.exists():
            self.stdout.write('Products exist. Run reload_products to update catalog.')
            return
        for data in PRODUCTS:
            Product.objects.create(**_defaults(data))
        self.stdout.write(self.style.SUCCESS(f'Seeded {len(PRODUCTS)} products.'))


def _defaults(data):
    d = dict(data)
    d.setdefault('is_on_sale', False)
    d.setdefault('sale_price', None)
    d.setdefault('tags', [])
    d.setdefault('sustainability_score', 50)
    return d
