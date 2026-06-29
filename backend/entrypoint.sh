#!/bin/bash
set -e

echo "Running migrations..."
python manage.py migrate --noinput

if [ "${SEED_PRODUCTS:-false}" = "true" ]; then
  echo "Seeding products..."
  python manage.py seed_products
fi

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Starting Gunicorn..."
exec gunicorn nike_clone.wsgi:application \
  --bind 0.0.0.0:8000 \
  --workers "${GUNICORN_WORKERS:-3}" \
  --timeout 120 \
  --access-logfile - \
  --error-logfile -
