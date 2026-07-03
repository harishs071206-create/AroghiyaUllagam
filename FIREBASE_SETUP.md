# Firebase Integration Guide for AroghiyaUllagam

## Step 1: Create Firebase Project

1. Go to https://console.firebase.google.com
2. Click "Create Project"
3. Name it: `aroghiya-ullagam`
4. Accept terms and create

## Step 2: Get Your Firebase Config

1. Go to Project Settings (⚙️ icon)
2. Under "Your apps", click "Web" or create new web app
3. Register app with nickname "Aroghiya Ullagam Web"
4. Copy the config object

## Step 3: Update firebase-config.js

Open `firebase-config.js` and replace the placeholder values with your actual config:

```javascript
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCsloM4Rku0_P0OsOfQbP_PmhBnuYPFJhU",
  authDomain: "aroghiyaullagam-e78eb.firebaseapp.com",
  projectId: "aroghiyaullagam-e78eb",
  storageBucket: "aroghiyaullagam-e78eb.firebasestorage.app",
  messagingSenderId: "336374595221",
  appId: "1:336374595221:web:dd1ca052b1f3702071659c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

## Step 4: Enable Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click **Create Database**
3. Choose **Start in production mode**
4. Select region closest to you
5. Click **Create**

## Step 5: Set Firestore Security Rules

Go to **Firestore > Rules** and replace with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write for authenticated users
    match /products/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /bills/{document=**} {
      allow read, write: if request.auth != null;
    }
    match /users/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Step 6: Enable Firebase Authentication

1. Go to **Authentication > Sign-in method**
2. Enable **Email/Password**
3. (Optional) Enable other providers like Google, GitHub

## Step 7: Update Your App

The app will now use:
- **Firestore** for products, bills, and user data
- **Firebase Auth** for login/logout
- **Cloud Storage** (optional) for oil product images

## Step 8: Deploy to Firebase Hosting (Optional)

If you want to host on Firebase:

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## Data Structure in Firestore

### Products Collection
```
/products/{productId}
  - id: "P0001"
  - name: "தேங்காய் எண்ணெய்"
  - category: "Oils"
  - price: 185.00
  - unit: "litre"
  - stock: 30
  - image: "/static/images/coconut_oil.jpg"
```

### Bills Collection
```
/bills/{billId}
  - id: "BILL0001"
  - date: "2026-06-30T12:00:00Z"
  - user: "admin"
  - items: [...]
  - subtotal: 100.00
  - discount: 0
  - tax: 5.00
  - total: 105.00
  - payment_mode: "Cash"
```

### Users Collection
```
/users/{userId}
  - email: "admin@aroghiya.com"
  - name: "Admin"
  - createdAt: timestamp
  - role: "admin"
```

## Next Steps

1. Complete all 6 steps above
2. Update `firebase-config.js` with your credentials
3. Run your Flask app: `python app.py`
4. Test login at http://127.0.0.1:5000

For questions, refer to Firebase documentation:
- https://firebase.google.com/docs/firestore
- https://firebase.google.com/docs/auth
- https://firebase.google.com/docs/web/setup
