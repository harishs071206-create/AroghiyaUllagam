# Firebase Connection Map for AroghiyaUllagam

## 🗺️ Complete Integration Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                 FIREBASE CONSOLE                            │
│          https://console.firebase.google.com               │
│                                                             │
│  Project: aroghiyaullagam-e78eb                            │
│  ├── Firestore Database (/products, /bills, /users)        │
│  ├── Authentication (Email/Password, Google, etc.)         │
│  └── Cloud Storage (optional for images)                   │
└──────────────────┬──────────────────────────────────────────┘
                   │
         ┌─────────┴──────────┐
         │                    │
         ▼                    ▼
    Web SDK              Firestore SDK
 (firebase-app.js)   (firebase-firestore.js)
         │                    │
         └─────────┬──────────┘
                   │
                   ▼
     ┌──────────────────────────────┐
     │  static/js/firebase-config.js│ ⭐ YOUR CREDENTIALS
     │  ├── apiKey                  │
     │  ├── authDomain              │
     │  ├── projectId               │
     │  ├── storageBucket           │
     │  ├── messagingSenderId       │
     │  └── appId                   │
     └──────┬───────────────────────┘
            │
    ┌───────┴─────────────────────────────┐
    │                                     │
    ▼                                     ▼
┌─────────────────┐          ┌──────────────────────┐
│  firebase-auth.js│          │  billing.js          │
│  ├── Sign Up    │          │  ├── loadProducts()  │
│  ├── Sign In    │          │  ├── saveBill()      │
│  ├── Sign Out   │          │  └── Dual Mode       │
│  └── Firebase   │          │      (Firestore +    │
│     Auth Events │          │       Flask API)     │
└─────┬───────────┘          └──────┬───────────────┘
      │                             │
      ▼                             ▼
┌─────────────────┐          ┌──────────────────────┐
│  login.html     │          │  billing.html        │
│  ├── Firebase   │          │  ├── Firebase SDKs   │
│    Auth SDK     │          │  ├── Product Grid    │
│  └── Form UI    │          │  ├── Cart Items      │
└─────┬───────────┘          │  └── Bill Summary    │
      │                       └──────┬───────────────┘
      │                             │
      │         ┌───────────────────┼────────────┐
      │         │                   │            │
      ▼         ▼                   ▼            ▼
   Flask    Firebase          Firebase    Firebase
  Session    Auth          Firestore       Config
  Manager    (UI)          (Data)          (Init)
     │        │              │               │
     │        │              │               │
     └────────┴──────────────┴───────────────┘
              │
              ▼
   ┌─────────────────────┐
   │    app.py           │
   │ (Flask Backend)     │
   │                     │
   │ Routes:             │
   │ ├── / (login)       │
   │ ├── /billing        │
   │ ├── /api/products   │◄──── FALLBACK to JSON
   │ ├── /save_bill      │      if Firebase fails
   │ ├── /bill_history   │
   │ └── /logout         │
   │                     │
   │ JSON Files:         │
   │ ├── products.json   │
   │ └── bills.json      │
   └─────────────────────┘
```

---

## 📂 File Connection Details

### 🔑 Configuration Files

#### `static/js/firebase-config.js` ⭐ MAIN CONFIG
- **Purpose**: Stores your Firebase credentials
- **Connected to**: ALL Firebase SDKs
- **Initialized by**: Global Firebase initialization on page load
- **Uses Firebase Console**: ✅ Yes
- **Status**: Active with your credentials

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyCsloM4Rku0_P0OsOfQbP_PmhBnuYPFJhU",  // From Firebase
  authDomain: "aroghiyaullagam-e78eb.firebaseapp.com",
  projectId: "aroghiyaullagam-e78eb",
  storageBucket: "aroghiyaullagam-e78eb.firebasestorage.app",
  messagingSenderId: "336374595221",
  appId: "1:336374595221:web:dd1ca052b1f3702071659c"
};
firebase.initializeApp(firebaseConfig);
```

---

### 🔐 Authentication Files

#### `templates/login.html`
- **SDKs Loaded**:
  - ✅ `firebase-app.js` (v10.7.0)
  - ✅ `firebase-auth.js` (v10.7.0)
  - ✅ `firebase-firestore.js` (v10.7.0)
- **Connected to**: 
  - Firebase Auth (email/password)
  - Firebase Config
  - `static/js/login.js`
  - `static/js/firebase-auth.js`
- **Functions**:
  - Form submission
  - User email/password input
  - Error display
- **Fallback**: Flask session authentication

#### `static/js/login.js`
- **Purpose**: Login form UI and event handling
- **Connected to**:
  - `templates/login.html` DOM
  - Firebase Auth (optional)
- **Functions**:
  - Button state management
  - Auto-focus username field
  - Form submission handling
- **Firebase Integration**: Ready for `firebase-auth.js`

#### `static/js/firebase-auth.js` ⭐ NEW
- **Purpose**: Firebase Authentication module
- **Connected to**:
  - Firebase Config (`firebase-config.js`)
  - `templates/login.html` (via DOM)
  - Firestore `/users` collection
- **Functions**:
  - `firebaseSignUp(email, password)`
  - `firebaseSignIn(email, password)`
  - `firebaseSignOut()`
  - `initializeFirebaseAuth()`
  - `storeUserSession(user)`
  - `isFirebaseAuthenticated()`
- **Firebase Features**: 
  - Email/Password Auth
  - Real-time auth state changes
  - User session storage

---

### 🛒 Billing & Products Files

#### `templates/billing.html`
- **SDKs Loaded**:
  - ✅ `firebase-app.js` (v10.7.0)
  - ✅ `firebase-firestore.js` (v10.7.0)
- **Connected to**:
  - Firebase Config
  - Firebase Firestore
  - `static/js/billing.js` (MAIN)
  - `static/js/firebase-migration.js` (optional)
- **Elements**:
  - Product grid (`#productGrid`)
  - Cart display (`#billItems`)
  - Bill summary (`#subtotal`, `#taxAmt`, `#totalAmt`)
  - Success modal (`#successModal`)

#### `static/js/billing.js` ⭐ KEY FILE
- **Purpose**: Billing system with Firestore + Flask API dual-mode
- **Connected to**:
  - Firebase Config (`firebase-config.js`)
  - Firestore `/products` collection
  - Firestore `/bills` collection
  - Flask API endpoints (`/api/products`, `/save_bill`)
- **Data Flow**:

```
┌─ Products Load ─┐
│                 │
├─→ Firestore    (if configured)
│   /products
│
└─→ Flask API    (if Firestore unavailable)
    /api/products

┌─ Bill Save ─┐
│             │
├─→ Firestore  (if configured)
│   /bills
│
└─→ Flask API  (if Firestore unavailable)
    /save_bill
```

- **Functions**:
  - `loadProducts()` - Load from Firestore or Flask
  - `renderProducts()` - Display product grid
  - `addToCart(productId)` - Add to cart
  - `saveBill()` - Save to Firestore or Flask
  - `calcTotals()` - Calculate bill amounts

---

### 🔄 Data Migration Files

#### `static/js/firebase-migration.js` ⭐ NEW
- **Purpose**: Migrate data between local JSON and Firestore
- **Connected to**:
  - Firebase Config (`firebase-config.js`)
  - Firestore `/products` collection
  - Firestore `/bills` collection
  - Browser Console (developer tools)
- **Functions**:
  - `migrateProductsToFirestore(data)` - Upload products JSON to Firestore
  - `migrateBillsToFirestore(data)` - Upload bills JSON to Firestore
  - `backupProductsFromFirestore()` - Download products from Firestore
  - `backupBillsFromFirestore()` - Download bills from Firestore
  - `deleteAllProductsFromFirestore()` - Delete all Firestore products
  - `deleteAllBillsFromFirestore()` - Delete all Firestore bills

---

### 🖥️ Backend Files

#### `app.py`
- **Purpose**: Flask backend with JSON storage
- **Connected to**:
  - `templates/login.html` (via routes)
  - `templates/billing.html` (via routes)
  - `products.json` (local storage)
  - `bills.json` (local storage)
- **Routes** (serve as fallback when Firestore unavailable):
  - `GET /api/products` - Returns products.json
  - `POST /save_bill` - Saves to bills.json
  - `GET /bill_history` - Returns bills.json
- **Firebase Integration**: 
  - ❌ Does NOT use Firestore directly
  - ✅ Provides fallback API for frontend
  - ✅ Uses session authentication

---

## 🔗 Data Connection Flows

### Flow 1: Product Loading

```
User visits /billing
    │
    ▼
billing.js → loadProducts()
    │
    ├─→ Firestore ✅ (if configured)
    │   └─→ GET /products collection
    │       └─→ Display in grid
    │
    └─→ Flask API ⚠️ (if Firestore unavailable)
        └─→ GET /api/products
            └─→ Display in grid
```

### Flow 2: Bill Saving

```
User clicks "Save Bill"
    │
    ▼
billing.js → saveBill()
    │
    ├─→ Firestore ✅ (if configured)
    │   └─→ POST /bills collection
    │       └─→ Show success modal
    │
    └─→ Flask API ⚠️ (if Firestore unavailable)
        └─→ POST /save_bill
            └─→ Show success modal
```

### Flow 3: Authentication

```
User enters email/password on login
    │
    ▼
login.html form
    │
    ├─→ Firebase Auth ✅ (if enabled)
    │   └─→ auth.signInWithEmailAndPassword()
    │       └─→ Redirect to /billing
    │
    └─→ Flask Auth ⚠️ (if Firebase unavailable)
        └─→ POST / (login route)
            └─→ Set session
            └─→ Redirect to /billing
```

---

## 📊 Firestore Collections Structure

### Collection: `/products`

```json
{
  "id": "P0001",
  "name": "தேங்காய் எண்ணெய்",
  "category": "Oils",
  "price": 185.0,
  "unit": "litre",
  "stock": 30,
  "image": "/static/images/coconut_oil.jpg",
  "createdAt": "2026-06-30T...",
  "updatedAt": "2026-06-30T..."
}
```

### Collection: `/bills`

```json
{
  "id": "BILL0001",
  "date": "2026-06-30",
  "user": "John Doe",
  "items": [
    {
      "id": "P0001",
      "name": "தேங்காய் எண்ணெய்",
      "price": 185.0,
      "unit": "litre",
      "qty": 2
    }
  ],
  "subtotal": 370.0,
  "discount": 37.0,
  "tax": 16.65,
  "total": 349.65,
  "payment_mode": "Cash",
  "createdAt": "2026-06-30T...",
  "updatedAt": "2026-06-30T..."
}
```

### Collection: `/users`

```json
{
  "email": "admin@aroghiya.com",
  "uid": "firebase_user_id",
  "displayName": "Admin",
  "lastLogin": "2026-06-30T...",
  "createdAt": "2026-06-30T..."
}
```

---

## ✅ Firebase Integration Checklist

- [x] Firebase config created (`firebase-config.js`)
- [x] Firebase SDKs included in templates
- [x] Authentication module created (`firebase-auth.js`)
- [x] Billing system supports Firestore (`billing.js`)
- [x] Data migration tools created (`firebase-migration.js`)
- [x] Fallback to Flask API implemented
- [x] Dual-mode architecture (Firebase + Flask)
- [ ] Firestore collections created (manual in Firebase Console)
- [ ] Firebase security rules updated (manual in Firebase Console)
- [ ] Firebase authentication enabled (manual in Firebase Console)
- [ ] Products migrated to Firestore (manual or via migration tool)

---

## 🚀 Next Steps

1. **Setup Firestore** (Firebase Console)
2. **Set Security Rules** (Firebase Console)
3. **Enable Authentication** (Firebase Console)
4. **Create Collections** (Firebase Console)
5. **Migrate Data** (use `firebase-migration.js` or manual)
6. **Test** (http://127.0.0.1:5000)

---

## 📚 File Reference Table

| File | Purpose | Firebase | Flask | Status |
|------|---------|----------|-------|--------|
| `firebase-config.js` | Config & Init | ✅ | ❌ | ✅ Active |
| `firebase-auth.js` | Authentication | ✅ | ❌ | ✅ New |
| `firebase-migration.js` | Data Migration | ✅ | ❌ | ✅ New |
| `billing.js` | Billing Logic | ✅ | ✅ | ✅ Dual-mode |
| `login.html` | Login UI | ✅ | ✅ | ✅ Active |
| `billing.html` | Billing UI | ✅ | ✅ | ✅ Active |
| `app.py` | Backend | ❌ | ✅ | ✅ Fallback |
| `products.json` | Product Data | ❌ | ✅ | ✅ Fallback |
| `bills.json` | Bill Data | ❌ | ✅ | ✅ Fallback |

---

**Status**: ✅ All files properly connected for Firebase integration!
