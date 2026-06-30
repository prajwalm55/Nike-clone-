from django.core.management.base import BaseCommand
from store.models import Product
from store.management.commands.seed_products import _defaults
from store.product_catalog import PRODUCTS


class Command(BaseCommand):
    help = 'Reload full product catalog (create or update all 30 products)'

    def handle(self, *args, **options):
        created, updated = 0, 0
        for data in PRODUCTS:
            defaults = _defaults(data)
            name = defaults.pop('name')
            obj, was_created = Product.objects.update_or_create(name=name, defaults=defaults)
            if was_created:
                created += 1
            else:
                updated += 1
        self.stdout.write(self.style.SUCCESS(
            f'Catalog reloaded: {created} created, {updated} updated ({len(PRODUCTS)} total).'
        ))
