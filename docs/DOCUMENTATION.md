# Nike Clone — Complete Documentation

> Full-stack Nike-inspired e-commerce demo for portfolios, learning, and technical interviews.  
> **Repository:** [github.com/prajwalm55/Nike-clone-](https://github.com/prajwalm55/Nike-clone-)

---

## Table of Contents

1. [Overview](#1-overview)
2. [Product Requirements Document (PRD)](#2-product-requirements-document-prd)
3. [Tech Stack & Versions](#3-tech-stack--versions)
4. [Architecture](#4-architecture)
5. [Installation & Setup](#5-installation--setup)
6. [Pages & Features](#6-pages--features)
7. [API Reference](#7-api-reference)
8. [Database & Seeding](#8-database--seeding)
9. [Deployment](#9-deployment)
10. [Testing](#10-testing)
11. [Project Structure](#11-project-structure)

---

## 1. Overview

**Nike Clone** is a production-style storefront that mirrors the look and feel of nike.com while adding interview-ready innovations: AI Shoe Finder, Smart Size Advisor, 360° product viewer, outfit builder, sustainability scores, membership tiers, and live trending indicators.

| Metric | Value |
|--------|-------|
| Products in catalog | 30 |
| Frontend pages | 18 |
| API endpoints | 20+ |
| Test coverage | 67 automated tests |

**Disclaimer:** This is an educational demo. It is not affiliated with Nike, Inc.

---

## 2. Product Requirements Document (PRD)

### 2.1 Problem Statement

Shoppers need a fast, modern sneaker storefront with discovery tools (not just a product grid), size confidence, and a cohesive Nike-like experience — without building from scratch every time for demos or portfolios.

### 2.2 Goals

| Goal | Success Criteria |
|------|------------------|
| Authentic Nike-like UI | Clean typography, hero banners, product cards with hover images |
| Full shopping flow | Browse → detail → cart → checkout → order history |
| Stand-out features | Shoe Finder, Size Advisor, Outfit Builder, Compare, Membership |
| Production readiness | Docker, env config, PostgreSQL, Gunicorn, static frontend build |
| Developer experience | Clear setup docs, seed commands, typed API client |

### 2.3 User Personas

| Persona | Needs |
|---------|-------|
| **Guest shopper** | Browse, search, add to cart via session, use Shoe Finder |
| **Member** | Login, wishlist, reviews, points/tiers, order history |
| **Interviewer / reviewer** | Unique features beyond CRUD, clean code, tests, deploy path |

### 2.4 Functional Requirements

#### Catalog & Discovery
- [x] 30 products across Men, Women, Kids, Unisex
- [x] Categories: Lifestyle, Running, Training, Jordan
- [x] Filters: gender, category, search, featured, new, sale
- [x] Sale pricing with discount badges
- [x] Sustainability scores (0–100)
- [x] Product tags (e.g. `recycled`, `trail`, `basketball`)

#### Product Detail
- [x] Image gallery with hover/second image
- [x] Size selector with validation
- [x] Add to cart, wishlist, compare
- [x] Reviews & star ratings
- [x] Smart Size Advisor (cross-brand size translation)
- [x] 360° drag-to-rotate viewer
- [x] Recently viewed (localStorage)

#### Cart & Checkout
- [x] Anonymous cart (session key) + authenticated cart
- [x] Quantity update, remove, clear
- [x] Free shipping over $150
- [x] Checkout creates order with tracking number
- [x] Order history page for logged-in users

#### Auth & Membership
- [x] Register, login, logout (token auth)
- [x] Member profile with points and tiers (Member → Gold → Platinum)
- [x] Points earned on purchases

#### Innovative Features
- [x] **AI Shoe Finder** — 5-step quiz → ranked recommendations
- [x] **Outfit Builder** — Pick lifestyle + performance + Jordan shoes
- [x] **Product Compare** — Side-by-side up to 3 products
- [x] **Trending** — Live viewer count simulation
- [x] **Lookbook** — Curated style inspiration
- [x] **Move to Zero** — Sustainability-focused product page
- [x] **Newsletter** — Email subscription API

### 2.5 Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| Performance | Lazy-loaded images, Vite production build |
| Security | Token auth, CORS, env-based secrets, CSRF for admin |
| Scalability | PostgreSQL in production, stateless API |
| Accessibility | Semantic HTML, aria labels on key controls |
| Maintainability | TypeScript frontend, Django app separation, seed commands |

### 2.6 Out of Scope (Demo Limitations)

- Real payment processing (Stripe/PayPal)
- Real email delivery for newsletter
- Inventory/stock depletion
- Admin product CRUD UI (use Django admin or seed commands)

---

## 3. Tech Stack & Versions

### Backend (Python)

| Package | Version | Purpose |
|---------|---------|---------|
| Python | 3.11+ | Runtime |
| Django | 4.2.30 | Web framework |
| djangorestframework | 3.17.1 | REST API |
| django-cors-headers | 4.9.0 | Cross-origin requests |
| gunicorn | 26.0.0 | Production WSGI server |
| whitenoise | 6.12.0 | Static file serving |
| psycopg2-binary | 2.9.12 | PostgreSQL driver |
| dj-database-url | 2.x | Database URL parsing |

### Frontend (Node.js)

| Package | Version | Purpose |
|---------|---------|---------|
| Node.js | 20.x recommended | Runtime |
| React | 18.3.1 | UI library |
| react-dom | 18.3.1 | DOM rendering |
| react-router-dom | 6.30.x | Client routing |
| TypeScript | 5.6.3 | Type safety |
| Vite | 5.4.21 | Build tool & dev server |
| @vitejs/plugin-react | 4.3.x | React HMR |

### Infrastructure

| Tool | Purpose |
|------|---------|
| SQLite | Local development database |
| PostgreSQL 15 | Production database (Docker) |
| Nginx | Reverse proxy + static files |
| Docker Compose | Multi-container orchestration |

---

## 4. Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser (React SPA)                   │
│  Pages · Context (Auth/Cart/Wishlist/Compare) · API Client  │
└────────────────────────────┬────────────────────────────────┘
                             │ HTTP /api/*
                             ▼
┌─────────────────────────────────────────────────────────────┐
│              Django REST Framework (Gunicorn)                │
│  Views · Serializers · Services · Token + Session Cart       │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                    PostgreSQL / SQLite                       │
│  Products · Carts · Orders · Reviews · Wishlist · Members    │
└─────────────────────────────────────────────────────────────┘
```

### Key Design Decisions

1. **Token authentication** — Simple, stateless auth for SPA; token stored in `localStorage`.
2. **Session cart for guests** — `X-Session-Key` header merges into user cart on login.
3. **Product catalog as Python module** — `product_catalog.py` is the single source of truth; `reload_products` upserts into DB.
4. **Recommendation logic in services** — `services.py` keeps views thin; easy to test and extend.
5. **Vite proxy in dev** — Frontend calls `/api` which proxies to Django on port 8000.

---

## 5. Installation & Setup

### 5.1 Prerequisites

```bash
# Verify versions
python3 --version    # 3.11+
node --version       # 18+ (20 recommended)
npm --version
```

### 5.2 Clone Repository

```bash
git clone https://github.com/prajwalm55/Nike-clone-.git
cd Nike-clone-
```

### 5.3 Backend Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py reload_products  # Loads all 30 products
python manage.py seed_reviews     # Optional: sample reviews
python manage.py runserver
```

**API base URL:** `http://127.0.0.1:8000/api/`

### 5.4 Frontend Setup

```bash
cd frontend
cp .env.example .env
npm install --include=optional
npm run dev
```

**App URL:** `http://localhost:5173`

### 5.5 Environment Variables

| Variable | Where | Description |
|----------|-------|-------------|
| `VITE_API_URL` | frontend `.env` | API base (default: `/api` via proxy) |
| `DJANGO_SETTINGS_MODULE` | backend | `nike_clone.settings.development` or `production` |
| `DJANGO_SECRET_KEY` | backend `.env` | Required in production |
| `DATABASE_URL` | backend `.env` | PostgreSQL connection string |
| `ALLOWED_HOSTS` | backend `.env` | Comma-separated hosts |
| `CORS_ALLOWED_ORIGINS` | backend `.env` | Frontend origin(s) |

### 5.6 Common Commands

```bash
# Reload product catalog after editing product_catalog.py
python manage.py reload_products

# Fix broken image URLs
python manage.py update_images

# Run backend tests
cd backend && python test_api.py && python test_e2e.py

# Production frontend build
cd frontend && npm run build
```

---

## 6. Pages & Features

### 6.1 Page Map

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Hero, sale, trending, categories, featured, new arrivals |
| `/products` | Products | Full catalog with filters |
| `/products/:id` | Product Detail | Gallery, sizes, reviews, size advisor, 360° viewer |
| `/cart` | Cart | Bag with checkout |
| `/auth` | Auth | Login & register |
| `/shoe-finder` | Shoe Finder | AI quiz recommendations |
| `/compare` | Compare | Side-by-side product comparison |
| `/wishlist` | Wishlist | Saved favorites |
| `/member` | Membership | Points, tiers, benefits |
| `/sale` | Sale | Discounted products |
| `/kids` | Kids | Kids collection |
| `/lookbook` | Lookbook | Curated outfit inspiration |
| `/sustainability` | Move to Zero | Eco-scored products |
| `/size-guide` | Size Guide | Sizing chart & fit tips |
| `/outfit-builder` | Outfit Builder | Mix 3 categories into one look |
| `/orders` | Orders | Order history (auth required) |
| `/about` | About | Project overview |
| `/help` | Help & FAQ | Support content |

### 6.2 Unique Features Explained

#### AI Shoe Finder
A 5-step wizard collects activity, surface, gender, experience, and budget. The backend scoring engine ranks products and returns match reasons — great for demonstrating recommendation logic in interviews.

#### Smart Size Advisor
Users enter their current brand and size; the API returns a recommended Nike size with confidence % and fit notes based on product category.

#### Outfit Builder
Pick one shoe from each slot (Everyday, Performance, Statement). Shows combined outfit total — demonstrates multi-category UX without a full wardrobe system.

#### 360° Product Viewer
Drag horizontally on the product image to cycle through angles (simulated with image offsets) — adds visual polish on the detail page.

#### Membership System
Points accrue on purchases. Tiers unlock at 500 (Gold) and 1500 (Platinum) points with visual progress on the Member page.

#### Trending Live
Products show simulated "X viewing" counts from the trending endpoint — demonstrates real-time-style UI patterns.

---

## 7. API Reference

Base URL: `/api/`

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products/` | List products. Query: `gender`, `category`, `search`, `featured`, `new`, `sale` |
| GET | `/products/:id/` | Product detail |
| GET | `/products/trending/` | Trending products with live viewer counts |

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register/` | Create account + token |
| POST | `/auth/login/` | Login + token |
| POST | `/auth/logout/` | Invalidate token |
| GET | `/auth/me/` | Current user profile |

### Cart

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/cart/` | Get cart (token or `X-Session-Key`) |
| POST | `/cart/add/` | Add item `{ product_id, size, quantity }` |
| PATCH | `/cart/items/:id/` | Update quantity/size |
| DELETE | `/cart/items/:id/` | Remove item |
| DELETE | `/cart/clear/` | Empty cart |

### Orders & Checkout

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/checkout/` | Convert cart to order (auth required) |
| GET | `/orders/` | Order history (auth required) |

### Reviews, Wishlist, Member

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | `/products/:id/reviews/` | List / add review |
| GET/POST/DELETE | `/wishlist/` | Wishlist CRUD |
| GET | `/member/` | Membership profile |

### Tools

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/shoe-finder/` | Get recommendations |
| POST | `/size-advisor/` | Get size advice |
| POST | `/newsletter/` | Subscribe email |

---

## 8. Database & Seeding

### Models

| Model | Purpose |
|-------|---------|
| `Product` | Catalog item with price, sale, tags, sustainability |
| `Cart` / `CartItem` | Shopping bag |
| `Order` / `OrderItem` | Completed purchases |
| `Review` | Product ratings |
| `WishlistItem` | Saved products |
| `MemberProfile` | Points and tier |
| `NewsletterSubscriber` | Email list |

### Seed Commands

```bash
python manage.py reload_products   # Upsert 30 products from catalog
python manage.py seed_products     # Initial seed (first run)
python manage.py update_images     # Refresh image URLs
python manage.py seed_reviews      # Sample review data
```

---

## 9. Deployment

### Docker (Recommended)

```bash
cp .env.example .env
# Set DJANGO_SECRET_KEY in .env

docker compose up --build -d
# App: http://localhost
```

### Free Hosting Suggestions

| Service | Role |
|---------|------|
| **Vercel** or **Netlify** | Frontend static build |
| **Render** or **Railway** | Django API + PostgreSQL |

Set `VITE_API_URL` to your deployed API URL when building the frontend.

---

## 10. Testing

```bash
cd backend
source venv/bin/activate
python test_api.py    # 48 API unit/integration tests
python test_e2e.py    # 19 end-to-end flow tests
```

Frontend build verification:

```bash
cd frontend && npm run build
```

---

## 11. Project Structure

```
nike-clone/
├── docs/
│   └── DOCUMENTATION.md      ← This file
├── backend/
│   ├── nike_clone/settings/  ← base, development, production
│   ├── store/
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   ├── services.py       ← Shoe Finder, Size Advisor, Trending
│   │   ├── product_catalog.py← 30 products source of truth
│   │   └── management/commands/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── test_api.py / test_e2e.py
├── frontend/
│   ├── src/
│   │   ├── api/client.ts
│   │   ├── context/          ← Auth, Cart, Wishlist, Compare
│   │   ├── pages/            ← 18 route pages
│   │   └── components/
│   ├── package.json
│   └── vite.config.ts
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Quick Interview Talking Points

1. **Why Django + React?** — Mature ecosystem, clear API boundary, easy to demo full-stack skills.
2. **Guest vs auth cart** — Session key pattern shows understanding of e-commerce edge cases.
3. **Recommendation engine** — Rule-based scoring in `services.py`; extensible to ML later.
4. **Production path** — Docker, Gunicorn, PostgreSQL, env-based settings — not just a tutorial app.
5. **30 products, 18 pages** — Substantial enough to feel real; seed commands keep data reproducible.

---

*Last updated: June 2026*
