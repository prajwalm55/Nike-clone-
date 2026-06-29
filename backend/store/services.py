"""Smart recommendation and sizing logic for Nike Clone."""

from decimal import Decimal

ACTIVITY_CATEGORY_MAP = {
    'running': ['Running'],
    'training': ['Training'],
    'lifestyle': ['Lifestyle', 'Jordan'],
    'racing': ['Running'],
}

BUDGET_RANGES = {
    'under150': (Decimal('0'), Decimal('150')),
    '150to200': (Decimal('150'), Decimal('200')),
    'over200': (Decimal('200'), Decimal('9999')),
}

# Brand size offset relative to Nike (positive = size up)
BRAND_OFFSETS = {
    'nike': 0.0,
    'adidas': 0.5,
    'new_balance': -0.5,
    'puma': 0.5,
}


def recommend_shoes(preferences):
    from .models import Product

    categories = ACTIVITY_CATEGORY_MAP.get(preferences['activity'], ['Lifestyle'])
    low, high = BUDGET_RANGES[preferences['budget']]

    qs = Product.objects.filter(
        category__in=categories,
        price__gte=low,
        price__lte=high,
    )

    gender = preferences['gender']
    if gender != 'unisex':
        qs = qs.filter(gender__in=[gender, 'unisex'])

    experience = preferences['experience']
    if experience == 'advanced':
        qs = qs.order_by('-price')
    elif experience == 'beginner':
        qs = qs.order_by('price')
    else:
        qs = qs.order_by('-is_featured', '-is_new')

    results = list(qs[:4])
    if len(results) < 4:
        extra = Product.objects.exclude(id__in=[p.id for p in results]).order_by('-is_featured')[:4 - len(results)]
        results.extend(extra)
    return results[:4]


def advise_size(brand, current_size, product):
    try:
        base = float(current_size)
    except ValueError:
        base = 10.0

    offset = BRAND_OFFSETS.get(brand, 0)
    recommended = base - offset
    recommended = round(recommended * 2) / 2

    available = [float(s) for s in product.sizes if _try_float(s) is not None]
    if available:
        closest = min(available, key=lambda s: abs(s - recommended))
        recommended = closest

    confidence = 92 if brand == 'nike' else 78

    fit_notes = {
        'nike': 'Nike generally fits true to size.',
        'adidas': 'Adidas runs slightly small — we adjusted up half a size.',
        'new_balance': 'New Balance runs slightly large — we adjusted down half a size.',
        'puma': 'Puma runs narrow — consider half size up for wide feet.',
    }

    return {
        'recommended_size': str(recommended),
        'confidence': confidence,
        'fit_note': fit_notes.get(brand, ''),
        'available_sizes': product.sizes,
    }


def get_trending_products():
    from .models import Product
    return list(
        Product.objects.annotate(
            review_avg=Avg('reviews__rating'),
            review_total=Count('reviews'),
        ).order_by('-is_featured', '-review_total', '-is_new')[:6]
    )


def _try_float(val):
    try:
        return float(val)
    except (ValueError, TypeError):
        return None
