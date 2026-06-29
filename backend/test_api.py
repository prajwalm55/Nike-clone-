#!/usr/bin/env python3
"""Comprehensive API integration tests for Nike Clone backend."""

import json
import sys
import urllib.error
import urllib.request
from uuid import uuid4

BASE = "http://127.0.0.1:8000/api"
passed = 0
failed = 0
errors = []


def req(method, path, data=None, headers=None):
    url = f"{BASE}{path}"
    body = json.dumps(data).encode() if data is not None else None
    h = {"Content-Type": "application/json", **(headers or {})}
    r = urllib.request.Request(url, data=body, headers=h, method=method)
    try:
        with urllib.request.urlopen(r) as resp:
            raw = resp.read().decode()
            return resp.status, json.loads(raw) if raw else {}
    except urllib.error.HTTPError as e:
        raw = e.read().decode()
        try:
            body = json.loads(raw) if raw else {}
        except json.JSONDecodeError:
            body = {"detail": raw}
        return e.code, body


def check(name, condition, detail=""):
    global passed, failed
    if condition:
        passed += 1
        print(f"  PASS  {name}")
    else:
        failed += 1
        msg = f"  FAIL  {name}" + (f" — {detail}" if detail else "")
        print(msg)
        errors.append(msg)


def section(title):
    print(f"\n{'='*60}\n{title}\n{'='*60}")


# ── Products ──────────────────────────────────────────────
section("PRODUCTS API")

status, products = req("GET", "/products/")
check("GET /products/ returns 200", status == 200)
check("Products list is non-empty", isinstance(products, list) and len(products) > 0, f"got {len(products) if isinstance(products, list) else 'non-list'}")
check("Products count is 12", len(products) == 12, f"got {len(products)}")

status, men = req("GET", "/products/?gender=men")
check("Filter by gender=men returns 200", status == 200)
check("Men products all have gender=men", all(p["gender"] == "men" for p in men), f"count={len(men)}")

status, women = req("GET", "/products/?gender=women")
check("Filter by gender=women returns 200", status == 200)
check("Women products all have gender=women", all(p["gender"] == "women" for p in women))

status, jordan = req("GET", "/products/?category=Jordan")
check("Filter by category=Jordan returns 200", status == 200)
check("Jordan products match category", all(p["category"] == "Jordan" for p in jordan), f"count={len(jordan)}")

status, featured = req("GET", "/products/?featured=true")
check("Filter featured=true returns 200", status == 200)
check("Featured products have is_featured", all(p["is_featured"] for p in featured), f"count={len(featured)}")

status, new = req("GET", "/products/?new=true")
check("Filter new=true returns 200", status == 200)
check("New products have is_new", all(p["is_new"] for p in new), f"count={len(new)}")

status, search = req("GET", "/products/?search=Air+Max")
check("Search returns 200", status == 200)
check("Search finds Air Max products", len(search) > 0 and all("Air Max" in p["name"] or "air max" in p["name"].lower() for p in search), f"count={len(search)}")

status, detail = req("GET", f"/products/{products[0]['id']}/")
check("GET product detail returns 200", status == 200)
check("Product detail has required fields", all(k in detail for k in ["id", "name", "price", "sizes", "description"]))

status, notfound = req("GET", "/products/99999/")
check("GET non-existent product returns 404", status == 404)

# ── Auth ──────────────────────────────────────────────────
section("AUTH API")

unique = uuid4().hex[:8]
username = f"testuser_{unique}"
email = f"test_{unique}@example.com"
password = "testpass123"

status, reg = req("POST", "/auth/register/", {
    "username": username, "email": email, "password": password,
    "first_name": "Test", "last_name": "User",
})
check("Register returns 201", status == 201, f"status={status}, body={reg}")
check("Register returns token", "token" in reg, str(reg))
check("Register returns user", reg.get("user", {}).get("username") == username, str(reg))
token = reg.get("token", "")

status, dup = req("POST", "/auth/register/", {
    "username": f"dup_{unique}", "email": email, "password": password,
})
check("Duplicate email returns 400", status == 400, f"status={status}")

status, login = req("POST", "/auth/login/", {"email": email, "password": password})
check("Login with email returns 200", status == 200)
check("Login returns token", "token" in login)
auth_token = login["token"]

status, badlogin = req("POST", "/auth/login/", {"email": email, "password": "wrongpass"})
check("Bad password returns 401", status == 401)

status, me = req("GET", "/auth/me/", headers={"Authorization": f"Token {auth_token}"})
check("GET /auth/me/ returns 200", status == 200)
check("Me returns correct user", me.get("email") == email)

status, nome = req("GET", "/auth/me/")
check("GET /auth/me/ without token returns 401", status == 401)

status, logout = req("POST", "/auth/logout/", headers={"Authorization": f"Token {auth_token}"})
check("Logout returns 200", status == 200)

status, me_after = req("GET", "/auth/me/", headers={"Authorization": f"Token {auth_token}"})
check("Me after logout returns 401", status == 401)

# Re-login for cart tests
status, login2 = req("POST", "/auth/login/", {"email": email, "password": password})
auth_token = login2["token"]

# ── Cart (anonymous) ─────────────────────────────────────
section("CART API — Anonymous")

session = f"anon-{uuid4().hex}"
sh = {"X-Session-Key": session}

status, nocart = req("GET", "/cart/")
check("GET cart without session returns 400", status == 400)

status, cart = req("GET", "/cart/", headers=sh)
check("GET cart with session returns 200", status == 200)
check("Empty cart has 0 items", cart.get("total_items", -1) == 0)

product_id = products[0]["id"]
size = products[0]["sizes"][0]

status, added = req("POST", "/cart/add/", {"product_id": product_id, "size": size, "quantity": 2}, headers=sh)
check("Add to cart returns 200", status == 200)
check("Cart has 1 item after add", len(added.get("items", [])) == 1)
check("Cart total_items is 2", added.get("total_items") == 2)
item_id = added["items"][0]["id"]

status, added2 = req("POST", "/cart/add/", {"product_id": product_id, "size": size, "quantity": 1}, headers=sh)
check("Adding same product+size increments qty", added2["items"][0]["quantity"] == 3)

status, updated = req("PATCH", f"/cart/items/{item_id}/", {"quantity": 5}, headers=sh)
check("Update cart item quantity", updated["items"][0]["quantity"] == 5)

status, removed = req("DELETE", f"/cart/items/{item_id}/", headers=sh)
check("Remove cart item returns 200", status == 200)
check("Cart empty after remove", removed.get("total_items") == 0)

# Add two different items then clear
p2 = products[1]
req("POST", "/cart/add/", {"product_id": product_id, "size": size, "quantity": 1}, headers=sh)
req("POST", "/cart/add/", {"product_id": p2["id"], "size": p2["sizes"][0], "quantity": 1}, headers=sh)
status, cleared = req("DELETE", "/cart/clear/", headers=sh)
check("Clear cart returns 200", status == 200)
check("Cart empty after clear", cleared.get("total_items") == 0)

status, badadd = req("POST", "/cart/add/", {"product_id": 99999, "size": "10", "quantity": 1}, headers=sh)
check("Add non-existent product returns 404", status == 404)

# ── Cart (authenticated) ──────────────────────────────────
section("CART API — Authenticated")

auth_h = {"Authorization": f"Token {auth_token}"}

status, authcart = req("GET", "/cart/", headers=auth_h)
check("Auth GET cart returns 200", status == 200)

status, authadd = req("POST", "/cart/add/", {"product_id": product_id, "size": size, "quantity": 1}, headers=auth_h)
check("Auth add to cart returns 200", status == 200)
check("Auth cart has items", authadd.get("total_items", 0) > 0)
auth_item_id = authadd["items"][0]["id"]

status, authremove = req("DELETE", f"/cart/items/{auth_item_id}/", headers=auth_h)
check("Auth remove item works", authremove.get("total_items") == 0)

# ── Frontend proxy ────────────────────────────────────────
section("FRONTEND PROXY")

try:
    proxy_req = urllib.request.Request("http://localhost:5173/api/products/")
    with urllib.request.urlopen(proxy_req) as resp:
        proxy_data = json.loads(resp.read().decode())
    check("Frontend proxy /api/products/ works", resp.status == 200 and len(proxy_data) > 0)
except Exception as e:
    check("Frontend proxy /api/products/ works", False, str(e))

# ── Summary ───────────────────────────────────────────────
section("SUMMARY")
total = passed + failed
print(f"\n  {passed}/{total} tests passed")
if failed:
    print(f"\n  FAILURES:")
    for e in errors:
        print(e)
    sys.exit(1)
else:
    print("\n  All tests passed!")
    sys.exit(0)
