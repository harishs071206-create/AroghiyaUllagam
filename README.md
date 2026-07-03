# 🌿 AroghiyaUllagam — ஆரோக்கிய உலகம்

A **grocery store billing web application** built with Flask (Python), featuring product management, billing, bill history, and thermal-style print receipts.

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
pip install -r requirements.txt
```

### 2. Run the app
```bash
python app.py
```

### 3. Open in browser
```
http://localhost:5000
```

### 4. Login
| Username | Password |
|----------|----------|
| `admin`  | `admin123` |

---

## 📁 Project Structure

```
AroghiyaUllagam/
├── app.py                  # Flask routes & logic
├── products.json           # Product database (auto-created)
├── bills.json              # Bills database (auto-created)
├── requirements.txt
│
├── templates/
│   ├── layout.html         # Base layout with navbar
│   ├── login.html          # Login page
│   ├── billing.html        # Main billing page
│   ├── add_product.html    # Product management
│   ├── bill_history.html   # Bill records & analytics
│   └── bill_print.html     # Thermal receipt (print-optimized)
│
├── static/
│   ├── css/
│   │   ├── style.css       # Global styles
│   │   ├── login.css       # Login page styles
│   │   ├── billing.css     # Billing UI styles
│   │   └── print.css       # Receipt / print styles
│   │
│   └── js/
│       ├── login.js        # Login UX
│       ├── billing.js      # Cart, search, save logic
│       └── print.js        # Print helpers
│
└── README.md
```

---

## ✨ Features

| Feature | Details |
|---------|---------|
| 🔐 Login | Secure session-based auth |
| 🧾 Billing | Real-time cart with quantity controls |
| 🔍 Search | Search & filter products by category |
| 💰 Discounts | Apply percentage discounts per bill |
| 🧮 Tax | Automatic 5% GST calculation |
| 💳 Payment | Cash / UPI / Card / Credit modes |
| 📦 Products | Add, edit, delete products with stock tracking |
| 📋 History | View all past bills with analytics |
| 🖨 Print | Thermal-style 80mm receipt printing |
| 📊 Stats | Revenue summary on history page |

---

## 🛠 Tech Stack

- **Backend**: Python 3, Flask
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Data**: JSON flat-file storage
- **Fonts**: Inter, Noto Sans Tamil (Google Fonts)

---

## 📝 Data Files

`products.json` and `bills.json` are created automatically on first run with sample grocery data.

To reset, delete these files and restart.

---

## 🌿 About the Name

**AroghiyaUllagam** (ஆரோக்கிய உலகம்) means **"Healthy World"** in Tamil — a name fit for a wholesome grocery store.
