# Firebase Realtime Database Setup Guide

## ✅ Problem Fixed!

Your app was trying to save to **Firestore** but you created a **Realtime Database**. Now it's configured correctly!

---

## 🔥 Quick Setup (2 Steps)

### Step 1: Set Realtime Database Rules

In Firebase Console:
1. Go to **Realtime Database > Rules**
2. Replace all content with:

```json
{
  "rules": {
    "products": {
      ".read": true,
      ".write": "auth != null || root.child('admin').child(auth.uid).exists()"
    },
    "bills": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "users": {
      ".read": "auth != null",
      ".write": "auth.uid === $uid"
    }
  }
}
```

3. Click **Publish**

---

### Step 2: Migrate Products

Open browser console (F12) at http://127.0.0.1:5000/billing and run:

```javascript
// First, get products from your local file
fetch('/api/products')
  .then(r => r.json())
  .then(products => {
    console.log('📦 Migrating', products.length, 'products...');
    migrateProductsToRealtime(products)
      .then(() => console.log('✅ Done!'))
      .catch(e => console.error('❌', e));
  });
```

Or paste this directly in console:

```javascript
// Products data
const products = [
  {"id":"P0001","name":"தேங்காய் எண்ணெய்","category":"Oils","price":185.0,"unit":"litre","stock":30,"image":"/static/images/coconut_oil.jpg"},
  {"id":"P0002","name":"எள்ளு எண்ணெய்","category":"Oils","price":220.0,"unit":"litre","stock":25,"image":"/static/images/sesame_oil.jpg"},
  {"id":"P0003","name":"கடலை எண்ணெய்","category":"Oils","price":210.0,"unit":"litre","stock":20,"image":"/static/images/groundnut_oil.avif"},
  {"id":"P0004","name":"சூரியகாந்தி எண்ணெய்","category":"Oils","price":190.0,"unit":"litre","stock":18,"image":"/static/images/sunflower_oil.jfif"},
  {"id":"P0005","name":"கடுகு எண்ணெய்","category":"Oils","price":200.0,"unit":"litre","stock":15,"image":"/static/images/mustard_oil.webp"},
  {"id":"P0006","name":"நிலச்சீறு எண்ணெய்","category":"Oils","price":175.0,"unit":"litre","stock":22,"image":"/static/images/nilachiru_oil.jfif"}
];

// Migrate to Realtime Database
migrateProductsToRealtime(products)
  .then(() => {
    console.log('✅ All 6 products migrated to Realtime Database!');
    location.reload();
  })
  .catch(e => console.error('❌ Error:', e));
```

---

## 📊 Realtime Database Structure

After setup, your database will look like:

```
aroghiyaullagam-e78eb
├── products/
│   ├── P0001: { id, name, price, unit, category, stock, image }
│   ├── P0002: { id, name, price, unit, category, stock, image }
│   ├── ... (6 total)
│
├── bills/
│   ├── -random-key-1: { user, items, subtotal, tax, total, date, ... }
│   ├── -random-key-2: { user, items, subtotal, tax, total, date, ... }
│   └── ...
│
└── users/
    └── firebase-uid: { email, lastLogin, ... }
```

---

## ✅ Files Updated

| File | Changes |
|------|---------|
| `firebase-realtime.js` | ✅ NEW - Realtime DB module |
| `billing.js` | ✅ Updated to use Realtime DB |
| `billing.html` | ✅ Updated SDKs (removed Firestore, added Database) |
| `login.html` | ✅ Updated SDKs (removed Firestore, added Database) |
| `firebase-config.js` | ✅ Works with both Firestore & Realtime DB |

---

## 🎯 Console Commands Available

### Load Products
```javascript
loadProductsFromRealtime()
  .then(products => console.log('Loaded:', products))
  .catch(e => console.error('Error:', e));
```

### Save a Bill
```javascript
const bill = {
  user: "John",
  items: [{ id: "P0001", name: "Oil", price: 100, qty: 1 }],
  subtotal: 100,
  discount: 0,
  tax: 5,
  total: 105,
  payment_mode: "Cash"
};

saveBillToRealtime(bill)
  .then(billId => console.log('✅ Saved with ID:', billId))
  .catch(e => console.error('❌ Error:', e));
```

### Load Bills
```javascript
loadBillsFromRealtime()
  .then(bills => console.log('Bills:', bills))
  .catch(e => console.error('Error:', e));
```

### Migrate Products
```javascript
const products = [...]; // Your products array
migrateProductsToRealtime(products)
  .then(() => console.log('✅ Migrated!'))
  .catch(e => console.error('❌ Error:', e));
```

---

## 🚀 Your App Now Works With:

✅ **Realtime Database** (Primary) - Live updates, stored in Firebase
✅ **Flask API** (Fallback) - Works if Realtime DB unavailable
✅ **Local JSON** (Backup) - products.json & bills.json files

**Automatic failover** - If Realtime DB has no products, app loads from Flask!

---

## 🔍 Verify Setup

1. Open http://127.0.0.1:5000/billing
2. Press F12 (Developer Console)
3. Check for messages:
   - ✅ "Firebase Realtime Database initialized!"
   - ✅ "Using Firebase Realtime Database for products and bills"
   - ✅ "Loading products from Realtime Database..."

4. Add a product to cart
5. Save a bill
6. Check Firebase Console → Realtime Database → bills folder

---

## 📱 Database URLs

| Type | URL |
|------|-----|
| **Realtime DB** | https://aroghiyaullagam-e78eb-default-rtdb.firebaseio.com/ |
| **Console** | https://console.firebase.google.com/project/aroghiyaullagam-e78eb/database |
| **Your App** | http://127.0.0.1:5000 |

---

## ⚠️ Important Notes

1. **Security Rules Required** - Update rules before using in production
2. **Migrate Products First** - App won't show products until you migrate
3. **Automatic Fallback** - If Realtime DB fails, uses Flask API
4. **Bills Auto-Save** - Saves to Realtime DB first, falls back to Flask

---

## 🆘 Troubleshooting

### Problem: "Loading products..." stays on screen
**Solution**: Migrate products to Realtime Database using console command above

### Problem: Firebase not initialized
**Solution**: Check browser console (F12) for errors, reload page

### Problem: Bills not saving
**Solution**: Check Realtime Database Rules are published correctly

### Problem: Can't see data in Firebase Console
**Solution**: Refresh Firebase Console page, or check Rules allow reads

---

## ✨ Success Checklist

- [ ] Set Realtime Database Rules
- [ ] Publish Rules in Firebase Console
- [ ] Migrate products using console command
- [ ] See "✅ Firebase Realtime Database initialized!" in console
- [ ] Add products to cart
- [ ] Save a bill
- [ ] See bills in Firebase Console → Realtime Database → bills

---

**🎉 You're all set to use Firebase Realtime Database!**

Just follow the 2 steps above and run the migration command.
