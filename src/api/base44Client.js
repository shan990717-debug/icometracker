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

// A standard base mock model
const baseModel = {
  list: async () => [],
  get: async () => null,
  create: async (data) => data,
  bulkCreate: async (data) => data,
  update: async (id, data) => data,
  delete: async () => true,
  query: () => createSmartMockModel()
};

// Use a JavaScript Proxy to catch array calls like .filter(), .map(), or .forEach()
const createSmartMockModel = () => {
  return new Proxy(baseModel, {
    get: (target, prop) => {
      // If the code is treating this model like an array, redirect it to an empty array fallback
      if (['filter', 'map', 'find', 'findIndex', 'forEach', 'reduce', 'slice', 'some', 'every', 'length'].includes(prop)) {
        return [][prop];
      }
      
      // Otherwise, return the standard database helper method
      return target[prop] !== undefined ? target[prop] : createSmartMockModel();
    }
  });
};

// Create the dynamic smart entities structure
export const entities = new Proxy({}, {
  get: (target, prop) => {
    if (!target[prop]) {
      target[prop] = createSmartMockModel();
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

// Root Default Export matching all layout targets
const base44Client = {
  db: db,
  base44: base44,
  entities: entities,
  ...base44
};

export default base44Client;
