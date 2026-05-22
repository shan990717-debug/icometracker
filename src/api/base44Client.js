import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where 
} from 'firebase/firestore';

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
export const db = getFirestore(app);
const auth = getAuth(app);

// Helper to check if a user is authenticated before hitting Firestore
const isUserLoggedOut = () => !auth.currentUser;

// A helper function that transforms database calls straight into Firebase queries safely
const createFirebaseModel = (collectionName) => ({
  filter: async (conditions = {}) => {
    if (isUserLoggedOut()) return []; // Silence permissions error if not logged in yet
    try {
      const colRef = collection(db, collectionName);
      let q = colRef;
      
      Object.keys(conditions).forEach((key) => {
        q = query(q, where(key, '==', conditions[key]));
      });

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.warn(`Handled filter restriction for ${collectionName}:`, error.message);
      return [];
    }
  },

  list: async () => {
    if (isUserLoggedOut()) return []; // Silence permissions error if not logged in yet
    try {
      const snapshot = await getDocs(collection(db, collectionName));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.warn(`Handled list restriction for ${collectionName}:`, error.message);
      return [];
    }
  },

  create: async (data) => {
    try {
      const docRef = await addDoc(collection(db, collectionName), data);
      return { id: docRef.id, ...data };
    } catch (error) {
      console.error(`Error creating document in ${collectionName}:`, error);
      throw error;
    }
  },

  bulkCreate: async (dataArray) => {
    if (isUserLoggedOut()) return dataArray;
    try {
      const results = [];
      for (const item of dataArray) {
        const docRef = await addDoc(collection(db, collectionName), item);
        results.push({ id: docRef.id, ...item });
      }
      return results;
    } catch (error) {
      console.error(`Error bulk creating in ${collectionName}:`, error);
      return dataArray;
    }
  },

  update: async (id, data) => {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, data);
      return { id, ...data };
    } catch (error) {
      console.error(`Error updating document in ${collectionName}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error(`Error deleting document in ${collectionName}:`, error);
      throw error;
    }
  }
});

// Explicitly provide structural engines for all tables used by the UI components
export const entities = {
  DailyRecord: createFirebaseModel('DailyRecord'),
  IncomeSource: createFirebaseModel('IncomeSource'),
  DeductionCategory: createFirebaseModel('DeductionCategory'),
  HouseholdBill: createFirebaseModel('HouseholdBill'),
};

export const base44 = {
  db,
  entities,
  query: async () => ({ data: [], error: null })
};

const base44Client = {
  db,
  base44,
  entities,
  ...entities
};

export default base44Client;
