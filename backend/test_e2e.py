#!/usr/bin/env python3
"""End-to-end user journey tests simulating frontend flows via API proxy."""

import json
import sys
import urllib.error
import urllib.request
from uuid import uuid4

API = "http://127.0.0.1:8000/api"
PROXY = "http://localhost:5173/api"
passed = 0
failed = 0
errors = []


def req(base, method, path, data=None, headers=None):
    url = f"{base}{path}"
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


print("\n" + "=" * 60)
print("E2E USER JOURNEY TESTS")
print("=" * 60)

# Journey 1: Browse homepage data via proxy
print("\n--- Journey 1: Browse products (via frontend proxy) ---")
s, featured = req(PROXY, "GET", "/products/?featured=true")
check("Proxy featured products", s == 200 and len(featured) > 0, f"status={s}")
s, newest = req(PROXY, "GET", "/products/?new=true")
check("Proxy new arrivals", s == 200 and len(newest) > 0)

# Journey 2: Filter men's shoes
print("\n--- Journey 2: Filter men's shoes ---")
s, men = req(PROXY, "GET", "/products/?gender=men")
check("Men's filter works", s == 200 and all(p["gender"] == "men" for p in men), f"count={len(men)}")

# Journey 3: Search
print("\n--- Journey 3: Search for Dunk ---")
s, results = req(PROXY, "GET", "/products/?search=Dunk")
check("Search returns results", s == 200 and len(results) > 0)
check("Search result matches", "Dunk" in results[0]["name"])

# Journey 4: View product detail
print("\n--- Journey 4: Product detail page ---")
product_id = men[0]["id"]
s, product = req(PROXY, "GET", f"/products/{product_id}/")
check("Product detail loads", s == 200)
check("Product has sizes for selector", len(product.get("sizes", [])) > 0)
check("Product has images", bool(product.get("image_url")))

# Journey 5: Anonymous shopping cart
print("\n--- Journey 5: Anonymous add to bag ---")
session = f"e2e-{uuid4().hex}"
sh = {"X-Session-Key": session}
size = product["sizes"][0]
s, cart = req(PROXY, "POST", "/cart/add/", {"product_id": product_id, "size": size, "quantity": 1}, sh)
check("Add to bag works", s == 200 and cart["total_items"] == 1)
item_id = cart["items"][0]["id"]
check("Cart subtotal calculated", float(cart["total_price"]) > 0)

# Journey 6: Update quantity in bag
print("\n--- Journey 6: Update bag quantity ---")
s, updated = req(PROXY, "PATCH", f"/cart/items/{item_id}/", {"quantity": 3}, sh)
check("Quantity update works", updated["items"][0]["quantity"] == 3)
check("Total items updated", updated["total_items"] == 3)

# Journey 7: Register and login
print("\n--- Journey 7: Member sign up & sign in ---")
uid = uuid4().hex[:8]
email = f"e2e_{uid}@test.com"
s, reg = req(PROXY, "POST", "/auth/register/", {
    "username": f"e2e_{uid}", "email": email, "password": "pass1234",
    "first_name": "E2E", "last_name": "Test",
})
check("Registration works", s == 201 and "token" in reg)
token = reg["token"]
auth = {"Authorization": f"Token {token}"}

s, me = req(PROXY, "GET", "/auth/me/", headers=auth)
check("Profile loads after register", me.get("email") == email)

s, login = req(PROXY, "POST", "/auth/login/", {"email": email, "password": "pass1234"})
check("Login works", s == 200 and "token" in login)

# Journey 8: Authenticated cart
print("\n--- Journey 8: Authenticated cart ---")
auth2 = {"Authorization": f"Token {login['token']}"}
s, authcart = req(PROXY, "POST", "/cart/add/", {"product_id": product_id, "size": size, "quantity": 2}, auth2)
check("Auth add to cart", s == 200 and authcart["total_items"] == 2)

# Journey 9: Remove from bag
print("\n--- Journey 9: Remove from bag ---")
auth_item = authcart["items"][0]["id"]
s, removed = req(PROXY, "DELETE", f"/cart/items/{auth_item}/", headers=auth2)
check("Remove from bag", removed["total_items"] == 0)

# Journey 10: Validation errors
print("\n--- Journey 10: Error handling ---")
s, badreg = req(PROXY, "POST", "/auth/register/", {"username": "x", "email": "bad", "password": "123"})
check("Invalid registration rejected", s == 400)
s, badlogin = req(PROXY, "POST", "/auth/login/", {"email": email, "password": "wrong"})
check("Wrong password rejected", s == 401)

# Summary
print("\n" + "=" * 60)
print("SUMMARY")
print("=" * 60)
total = passed + failed
print(f"\n  {passed}/{total} E2E tests passed")
if failed:
    for e in errors:
        print(e)
    sys.exit(1)
print("\n  All E2E journeys passed!")
sys.exit(0)
