from django.core.management.base import BaseCommand
from store.models import Product


def img(photo_id: int) -> str:
    return (
        f"https://images.pexels.com/photos/{photo_id}/"
        f"pexels-photo-{photo_id}.jpeg?auto=compress&w=800"
    )


PRODUCTS = [
    {
        "name": "Air Jordan 1 Retro High OG",
        "subtitle": "Men's Shoes",
        "description": "The Air Jordan 1 Retro High OG brings back the iconic silhouette that started it all. Premium leather upper with classic color blocking and the legendary Wings logo.",
        "price": 180.00,
        "category": "Jordan",
        "gender": "men",
        "color": "Black/White/Red",
        "image_url": img(2529148),
        "image_url_2": img(2529156),
        "sizes": ["7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12", "13"],
        "is_featured": True,
        "is_new": False,
    },
    {
        "name": "Nike Air Max 90",
        "subtitle": "Men's Shoes",
        "description": "Nothing as legendary. The Nike Air Max 90 stays true to its OG running roots with the iconic Waffle sole, stitched overlays and classic TPU accents.",
        "price": 130.00,
        "category": "Lifestyle",
        "gender": "men",
        "color": "White/Black",
        "image_url": img(1032110),
        "image_url_2": img(1598505),
        "sizes": ["7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12"],
        "is_featured": True,
        "is_new": False,
    },
    {
        "name": "Nike Dunk Low",
        "subtitle": "Women's Shoes",
        "description": "Created for the hardwood but taken to the streets, the '80s b-ball icon returns with classic details and throwback hoops flair.",
        "price": 115.00,
        "category": "Lifestyle",
        "gender": "women",
        "color": "White/Pink",
        "image_url": img(267301),
        "image_url_2": img(2529118),
        "sizes": ["5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10"],
        "is_featured": True,
        "is_new": True,
    },
    {
        "name": "Nike Air Force 1 '07",
        "subtitle": "Men's Shoes",
        "description": "Comfortable, durable and timeless. The radiance lives on in the Nike Air Force 1 '07, the b-ball OG that puts a fresh spin on what you know best.",
        "price": 115.00,
        "category": "Lifestyle",
        "gender": "men",
        "color": "White",
        "image_url": img(1456706),
        "image_url_2": img(1464625),
        "sizes": ["7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12", "13"],
        "is_featured": False,
        "is_new": False,
    },
    {
        "name": "Nike Air Max 270",
        "subtitle": "Women's Shoes",
        "description": "Nike's first lifestyle Air Max brings you style, comfort and big attitude in the Nike Air Max 270. The shoe's design draws inspiration from Air Max icons.",
        "price": 160.00,
        "category": "Lifestyle",
        "gender": "women",
        "color": "Black/White",
        "image_url": img(298863),
        "image_url_2": img(336372),
        "sizes": ["5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10"],
        "is_featured": False,
        "is_new": True,
    },
    {
        "name": "Nike React Infinity Run Flyknit 3",
        "subtitle": "Men's Running Shoes",
        "description": "We made the Nike React Infinity Run Flyknit to help reduce injury and keep you on the run. More foam and improved upper details provide a secure and cushioned feel.",
        "price": 160.00,
        "category": "Running",
        "gender": "men",
        "color": "Black/Volt",
        "image_url": img(643471),
        "image_url_2": img(631986),
        "sizes": ["7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12"],
        "is_featured": False,
        "is_new": True,
    },
    {
        "name": "Nike Pegasus 40",
        "subtitle": "Women's Running Shoes",
        "description": "You can rely on the Nike Pegasus 40 when your road runs take you from flat city streets to challenging hills and all that lies in between.",
        "price": 130.00,
        "category": "Running",
        "gender": "women",
        "color": "White/Pink Blast",
        "image_url": img(1478442),
        "image_url_2": img(298845),
        "sizes": ["5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10"],
        "is_featured": False,
        "is_new": False,
    },
    {
        "name": "Nike Metcon 8",
        "subtitle": "Men's Training Shoes",
        "description": "The Nike Metcon 8 is the gold standard for weightlifting—even tougher and more stable than previous versions. We added more flexibility to the forefoot.",
        "price": 150.00,
        "category": "Training",
        "gender": "men",
        "color": "Black/White",
        "image_url": img(2529156),
        "image_url_2": img(1032110),
        "sizes": ["7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12"],
        "is_featured": False,
        "is_new": False,
    },
    {
        "name": "Nike Blazer Mid '77",
        "subtitle": "Women's Shoes",
        "description": "In the '70s, Nike was the new shoe on the block. So new in fact, we were still working on a name and ended up with the Swoosh. The Nike Blazer Mid '77 delivers a slice of Nike style.",
        "price": 100.00,
        "category": "Lifestyle",
        "gender": "women",
        "color": "White/Black",
        "image_url": img(1598505),
        "image_url_2": img(267301),
        "sizes": ["5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10"],
        "is_featured": True,
        "is_new": False,
    },
    {
        "name": "Nike ZoomX Vaporfly NEXT% 2",
        "subtitle": "Men's Racing Shoes",
        "description": "Continue the next evolution of speed with a racing shoe made to help you chase new goals and records. The Nike ZoomX Vaporfly NEXT% 2 builds on the model racers everywhere.",
        "price": 250.00,
        "category": "Running",
        "gender": "men",
        "color": "Volt/Black",
        "image_url": img(1456706),
        "image_url_2": img(298863),
        "sizes": ["7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12"],
        "is_featured": False,
        "is_new": True,
    },
    {
        "name": "Nike Air Max 1",
        "subtitle": "Unisex Shoes",
        "description": "The Nike Air Max 1 stays true to its OG roots with the same design and tech that made the shoe an icon. Visible Air cushioning and a classic silhouette.",
        "price": 140.00,
        "category": "Lifestyle",
        "gender": "unisex",
        "color": "White/Red",
        "image_url": img(1464625),
        "image_url_2": img(336372),
        "sizes": ["5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12"],
        "is_featured": True,
        "is_new": False,
    },
    {
        "name": "Nike Free Metcon 5",
        "subtitle": "Women's Training Shoes",
        "description": "The Nike Free Metcon 5 combines the flexibility of Nike Free with the stability of Metcon. It's the training shoe that lets you lift, run and cut with confidence.",
        "price": 120.00,
        "category": "Training",
        "gender": "women",
        "color": "Black/White",
        "image_url": img(631986),
        "image_url_2": img(1478442),
        "sizes": ["5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10"],
        "is_featured": False,
        "is_new": False,
    },
]


class Command(BaseCommand):
    help = 'Seed the database with Nike product data'

    def handle(self, *args, **options):
        if Product.objects.exists():
            self.stdout.write('Products already exist. Skipping seed.')
            return

        for data in PRODUCTS:
            Product.objects.create(**data)

        self.stdout.write(self.style.SUCCESS(f'Seeded {len(PRODUCTS)} products.'))
