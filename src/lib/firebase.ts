// ─── Firebase Configuration ───────────────────────────────────────────────────
// Replace the placeholder values below with your actual Firebase project config.
// Get these from: Firebase Console → Project Settings → Your Apps → Web App → SDK Setup
//
// HOW TO SET UP (takes ~3 minutes):
//  1. Go to https://console.firebase.google.com/
//  2. Click "Create a project" → name it "techbazaar-pro" → Continue
//  3. Click the </> (Web) icon to add a web app → name it anything → Register app
//  4. Copy the firebaseConfig object shown and paste the values below
//  5. In Firebase Console → Build → Firestore Database → Create database → Start in TEST mode
//  6. Save this file — your app will instantly sync across all devices!
// ──────────────────────────────────────────────────────────────────────────────

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY            || "YOUR_API_KEY",
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN        || "YOUR_PROJECT.firebaseapp.com",
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID         || "YOUR_PROJECT_ID",
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET     || "YOUR_PROJECT.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "YOUR_SENDER_ID",
  appId:             import.meta.env.VITE_FIREBASE_APP_ID             || "YOUR_APP_ID",
};

// Detect if real config has been provided
export const isFirebaseConfigured = (
  firebaseConfig.apiKey !== "YOUR_API_KEY" &&
  firebaseConfig.projectId !== "YOUR_PROJECT_ID"
);

let app;
let db: ReturnType<typeof getFirestore> | null = null;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  } catch (e) {
    console.error('[Firebase] Init failed — falling back to localStorage:', e);
  }
} else {
  console.warn(
    '[TechBazaar] Firebase not configured yet.\n' +
    'User data is stored in this browser only.\n' +
    'Set up Firebase to sync data across all devices.\n' +
    'See: src/lib/firebase.ts for instructions.'
  );
}

export { db };
