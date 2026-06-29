# Nike Clone

A production-ready full-stack Nike-style e-commerce app built with **Django REST Framework** and **React + TypeScript**.

Live-style features: product catalog, search & filters, product detail with size selection, shopping cart (anonymous + authenticated), and user auth.

Repository: [github.com/prajwalm55/Nike-clone-](https://github.com/prajwalm55/Nike-clone-)

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Django 4.2, Django REST Framework, Token Auth |
| Frontend | React 18, TypeScript, Vite, React Router |
| Database | SQLite (dev) / PostgreSQL (production) |
| Deployment | Docker, Gunicorn, Nginx, WhiteNoise |

## Quick Start (Development)

### Prerequisites

- Python 3.11+
- Node.js 18+ (20 recommended)

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_products
python manage.py runserver
```

API: http://127.0.0.1:8000/api/

### Frontend

```bash
cd frontend
cp .env.example .env
npm install --include=optional
npm run dev
```

App: http://localhost:5173

## Production Deployment (Docker)

The fastest way to run the full stack in production mode:

```bash
# 1. Copy and configure environment
cp .env.example .env
# Edit .env — set DJANGO_SECRET_KEY (required)

# 2. Build and start
docker compose up --build -d

# 3. Open the app
open http://localhost
```

This starts:
- **PostgreSQL** database
- **Django + Gunicorn** API on port 8000 (internal)
- **Nginx** serving the React build and proxying `/api` on port 80

### Generate a secret key

```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DJANGO_SECRET_KEY` | Yes (prod) | Random secret key |
| `DJANGO_ALLOWED_HOSTS` | Yes (prod) | Comma-separated hostnames |
| `CORS_ALLOWED_ORIGINS` | Yes (prod) | Comma-separated frontend URLs |
| `DATABASE_URL` | No | PostgreSQL URL (Docker sets this automatically) |
| `SEED_PRODUCTS` | No | `true` to load sample products on first deploy |
| `PORT` | No | Host port (default `80`) |

See [.env.example](.env.example) for a full template.

## Project Structure

```
nike-clone/
├── backend/
│   ├── store/                  # Products, Cart, Auth API
│   ├── nike_clone/settings/    # base, development, production
│   ├── Dockerfile
│   ├── entrypoint.sh
│   └── requirements.txt
├── frontend/
│   ├── src/
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.yml
└── .env.example
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products/` | List products (`?gender`, `?category`, `?search`, `?featured`, `?new`) |
| GET | `/api/products/<id>/` | Product detail |
| POST | `/api/auth/register/` | Register |
| POST | `/api/auth/login/` | Login |
| POST | `/api/auth/logout/` | Logout (token required) |
| GET | `/api/auth/me/` | Current user |
| GET | `/api/cart/` | Get cart |
| POST | `/api/cart/add/` | Add to cart |
| PATCH | `/api/cart/items/<id>/` | Update quantity |
| DELETE | `/api/cart/items/<id>/` | Remove item |
| DELETE | `/api/cart/clear/` | Clear cart |

Anonymous carts use the `X-Session-Key` header (auto-generated in the browser).

## Management Commands

```bash
python manage.py seed_products    # Load 12 sample products (first run only)
python manage.py update_images    # Refresh product image URLs
```

## Running Tests

```bash
# Backend API tests (server must be running)
cd backend && source venv/bin/activate
python test_api.py
python test_e2e.py

# Frontend build check
cd frontend && npm run build
```

## What Makes This Project Stand Out (Interview Highlights)

This is **not a basic CRUD e-commerce clone**. It demonstrates product thinking and full-stack engineering:

| Feature | What It Shows |
|---------|---------------|
| **AI Shoe Finder** | Multi-step quiz → backend recommendation engine scoring products by activity, surface, experience & budget |
| **Smart Size Advisor** | Cross-brand size conversion algorithm (Nike/Adidas/NB/Puma) with confidence scoring |
| **360° Product Viewer** | Drag-to-rotate interactive viewer using pointer events |
| **Product Comparison** | Side-by-side compare up to 3 shoes with floating compare bar |
| **Wishlist / Favorites** | Authenticated persistence with member points gamification |
| **Reviews & Ratings** | Full review system with star ratings and aggregate scores |
| **Nike Membership** | Tiered loyalty program (Member → Gold → Platinum) with points on actions |
| **Live Trending** | Real-time viewer counts and trending product algorithm |
| **Recently Viewed** | Client-side browsing history with localStorage persistence |

### Architecture Talking Points

- **Separation of concerns**: Recommendation logic in `services.py`, not views
- **Dual cart strategy**: Anonymous session carts + authenticated user carts
- **Production-ready**: Docker, PostgreSQL, Gunicorn, Nginx, env-based settings
- **Type-safe frontend**: Full TypeScript with React Context for state management


MIT — for educational purposes. Not affiliated with Nike, Inc.
