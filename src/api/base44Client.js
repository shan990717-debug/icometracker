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

// A generic mock model helper that mirrors all Base44 data fetching methods
const createMockModel = () => ({
  list: async () => [],
  get: async () => null,
  create: async (data) => data,
  bulkCreate: async (data) => data,
  update: async (id, data) => data,
  delete: async () => true,
  query: () => ({
    where: () => createMockModel(),
    order: () => createMockModel(),
    exec: async () => []
  })
});

// Create the exact entities structure the app expects
export const entities = {
  IncomeSource: createMockModel(),
  DailyRecord: createMockModel(),
  DeductionCategory: createMockModel(),
  HouseholdBill: createMockModel(),
};

// Explicit Named Export for the 'base44' object
export const base44 = {
  db: db,
  entities: entities,
  query: async () => ({ data: [], error: null }),
};

// Root Default Export matching all possible structural styles
const base44Client = {
  db: db,
  base44: base44,
  entities: entities,
  ...base44
};

export default base44Client;
