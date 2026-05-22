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

// A clean database model blueprint that acts like BOTH an object and a safe array generator
const createCleanMockModel = () => {
  return {
    // Standard Base44 database execution styles
    list: async () => [],
    get: async () => null,
    create: async (data) => data,
    bulkCreate: async (data) => data,
    update: async (id, data) => data,
    delete: async () => true,
    
    // In case the code uses base44.entities.DailyRecord.query().where().exec()
    query: () => ({
      where: () => createCleanMockModel(),
      order: () => createCleanMockModel(),
      exec: async () => []
    })
  };
};

// Auto-generating objects dynamically so any referenced table (DailyRecord, etc.) handles array safety perfectly
export const entities = new Proxy({}, {
  get: (target, prop) => {
    if (!target[prop]) {
      target[prop] = createCleanMockModel();
    }
    return target[prop];
  }
});

// Explicit Named Export for the 'base44' object
export const base44 = {
  db: db,
  entities: entities,
  query: async () => ({ data: [], error: null }),
};

// Root Default Export matching all layout targets across the codebase
const base44Client = {
  db: db,
  base44: base44,
  entities: entities,
  ...entities
};

export default base44Client;
