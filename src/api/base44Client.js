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

// A generic mock model helper to prevent crashes when reading or seeding data
const createMockModel = () => ({
  list: async () => [],
  get: async () => null,
  create: async (data) => data,
  update: async (id, data) => data,
  delete: async () => true,
  // Base44 often uses a .query() chain, so we mock that too
  query: () => ({
    where: () => createMockModel(),
    order: () => createMockModel(),
    exec: async () => []
  })
});

// Create a safe mock object containing the models the app is looking for
export const base44 = {
  db: db,
  IncomeSource: createMockModel(),
  DailyRecord: createMockModel(),
  // Adding a generic fallback just in case there are other tables like 'User' or 'Settings'
  query: async () => ({ data: [], error: null }),
};

// Default export to keep both styles of imports happy
const base44Client = {
  db: db,
  ...base44
};

export default base44Client;
