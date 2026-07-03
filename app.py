c:\Users\ADMIN\AppData\Local\Temp\Rar$DRa9620.12550\AroghiyaUllagam\bills.jsonfrom flask import Flask, render_template, request, redirect, url_for, session, jsonify
import json
import os
from datetime import datetime

app = Flask(__name__, template_folder="templates")
app.secret_key = "aroghiya_secret_2024"

PRODUCTS_FILE = "products.json"
BILLS_FILE = "bills.json"

def load_json(filepath):
    if not os.path.exists(filepath):
        return []
    with open(filepath, "r", encoding="utf-8") as f:
        try:
            return json.load(f)
        except (json.JSONDecodeError, UnicodeDecodeError):
            return []

def save_json(filepath, data):
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

# ---------- Auth ----------
@app.route("/", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        if username == "admin" and password == "admin123":
            session["user"] = username
            return redirect(url_for("billing"))
        return render_template("login.html", error="Invalid credentials")
    return render_template("login.html")

@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("login"))

# ---------- Billing ----------
@app.route("/billing")
def billing():
    if "user" not in session:
        return redirect(url_for("login"))
    products = load_json(PRODUCTS_FILE)
    return render_template("billing.html", products=products)

@app.route("/save_bill", methods=["POST"])
def save_bill():
    if "user" not in session:
        return jsonify({"error": "Unauthorized"}), 401
    data = request.get_json()
    bills = load_json(BILLS_FILE)
    bill_id = f"BILL{len(bills)+1:04d}"
    user_name = data.get("user") or data.get("customer") or "Walk-in"
    bill = {
        "id": bill_id,
        "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "user": user_name,
        "customer": user_name,
        "items": data.get("items", []),
        "subtotal": data.get("subtotal", 0),
        "discount": data.get("discount", 0),
        "tax": data.get("tax", 0),
        "total": data.get("total", 0),
        "payment_mode": data.get("payment_mode", "Cash"),
    }
    bills.append(bill)
    save_json(BILLS_FILE, bills)
    return jsonify({"success": True, "bill_id": bill_id})

# ---------- Products ----------
@app.route("/add_product", methods=["GET", "POST"])
def add_product():
    if "user" not in session:
        return redirect(url_for("login"))
    products = load_json(PRODUCTS_FILE)
    if request.method == "POST":
        action = request.form.get("action")
        if action == "add":
            product = {
                "id": f"P{len(products)+1:04d}",
                "name": request.form.get("name"),
                "category": request.form.get("category"),
                "price": float(request.form.get("price", 0)),
                "unit": request.form.get("unit"),
                "stock": int(request.form.get("stock", 0)),
            }
            products.append(product)
            save_json(PRODUCTS_FILE, products)
        elif action == "delete":
            pid = request.form.get("product_id")
            products = [p for p in products if p["id"] != pid]
            save_json(PRODUCTS_FILE, products)
        elif action == "edit":
            pid = request.form.get("product_id")
            for p in products:
                if p["id"] == pid:
                    p["name"] = request.form.get("name")
                    p["category"] = request.form.get("category")
                    p["price"] = float(request.form.get("price", 0))
                    p["unit"] = request.form.get("unit")
                    p["stock"] = int(request.form.get("stock", 0))
            save_json(PRODUCTS_FILE, products)
        return redirect(url_for("add_product"))
    return render_template("add_product.html", products=products)

@app.route("/api/products")
def api_products():
    return jsonify(load_json(PRODUCTS_FILE))

# ---------- Bill History ----------
@app.route("/bill_history")
def bill_history():
    if "user" not in session:
        return redirect(url_for("login"))
    bills = load_json(BILLS_FILE)
    bills.sort(key=lambda x: x["date"], reverse=True)
    return render_template("bill_history.html", bills=bills)

@app.route("/bill_print/<bill_id>")
def bill_print(bill_id):
    if "user" not in session:
        return redirect(url_for("login"))
    bills = load_json(BILLS_FILE)
    bill = next((b for b in bills if b["id"] == bill_id), None)
    if not bill:
        return "Bill not found", 404
    return render_template("bill_print.html", bill=bill)

@app.route("/delete_bill/<bill_id>", methods=["POST"])
def delete_bill(bill_id):
    if "user" not in session:
        return redirect(url_for("login"))
    bills = load_json(BILLS_FILE)
    bills = [b for b in bills if b["id"] != bill_id]
    save_json(BILLS_FILE, bills)
    return redirect(url_for("bill_history"))

if __name__ == "__main__":
    if not os.path.exists(PRODUCTS_FILE) or not load_json(PRODUCTS_FILE):
        save_json(PRODUCTS_FILE, [
            {"id": "P0001", "name": "தேங்காய் எண்ணெய்", "category": "Oils", "price": 185.00, "unit": "litre", "stock": 30, "image": "/static/images/coconut_oil.jpg"},
            {"id": "P0002", "name": "எள்ளு எண்ணெய்", "category": "Oils", "price": 220.00, "unit": "litre", "stock": 25, "image": "/static/images/sesame_oil.jpg"},
            {"id": "P0003", "name": "கடலை எண்ணெய்", "category": "Oils", "price": 210.00, "unit": "litre", "stock": 20, "image": "/static/images/groundnut_oil.avif"},
            {"id": "P0004", "name": "சூரியகாந்தி எண்ணெய்", "category": "Oils", "price": 190.00, "unit": "litre", "stock": 18, "image": "/static/images/sunflower_oil.jfif"},
            {"id": "P0005", "name": "கடுகு எண்ணெய்", "category": "Oils", "price": 200.00, "unit": "litre", "stock": 15, "image": "/static/images/mustard_oil.webp"},
            {"id": "P0006", "name": "நிலச்சீறு எண்ணெய்", "category": "Oils", "price": 175.00, "unit": "litre", "stock": 22, "image": "/static/images/nilachiru_oil.jfif"},
        ])
    if not os.path.exists(BILLS_FILE):
        save_json(BILLS_FILE, [])
    app.run(debug=True)
