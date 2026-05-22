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
  query: () => ({
    where: () => createMockModel(),
    order: () => createMockModel(),
    exec: async () => []
  })
});

// 1. Explicit Named Exports for the models
export const IncomeSource = createMockModel();
export const DailyRecord = createMockModel();

// 2. Explicit Named Export for the 'base44' object containing the models
export const base44 = {
  db: db,
  IncomeSource: IncomeSource,
  DailyRecord: DailyRecord,
  query: async () => ({ data: [], error: null }),
};

// 3. Root Default Export combining everything
const base44Client = {
  db: db,
  base44: base44,
  IncomeSource: IncomeSource,
  DailyRecord: DailyRecord,
  ...base44
};

export default base44Client;
