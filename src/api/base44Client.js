import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration using Vite environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase safely
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore Database
export const db = getFirestore(app);

// Create a safe mock object to satisfy components still trying to call old base44 methods
export const base44 = {
  db: db,
  // We mock a standard query method just in case PageNotFound or other pages attempt to call it
  query: async () => ({ data: [], error: null }),
  get: async () => ({ data: null, error: null }),
  post: async () => ({ data: null, error: null })
};

// Default export to keep both styles of imports happy
const base44Client = {
  db: db,
  ...base44
};

export default base44Client;
