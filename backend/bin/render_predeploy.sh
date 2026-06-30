#!/usr/bin/env bash
# Render pre-deploy: migrate DB and load product catalog
set -e
python manage.py migrate --noinput
python manage.py reload_products
