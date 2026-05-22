import { initializeApp, getApps, getApp } from 'firebase/app';
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

// A helper function that transforms database calls straight into Firebase queries
const createFirebaseModel = (collectionName) => ({
  // Handles filtering data inline (e.g., .filter({ date: selectedDate }))
  filter: async (conditions = {}) => {
    try {
      const colRef = collection(db, collectionName);
      let q = colRef;
      
      // Map query conditions dynamically
      Object.keys(conditions).forEach((key) => {
        q = query(q, where(key, '==', conditions[key]));
      });

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error(`Error filtering ${collectionName}:`, error);
      return [];
    }
  },

  // Handles basic index requests (e.g., .list())
  list: async () => {
    try {
      const snapshot = await getDocs(collection(db, collectionName));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error(`Error listing ${collectionName}:`, error);
      return [];
    }
  },

  // Handles record creation (e.g., .create(record))
  create: async (data) => {
    try {
      const docRef = await addDoc(collection(db, collectionName), data);
      return { id: docRef.id, ...data };
    } catch (error) {
      console.error(`Error creating document in ${collectionName}:`, error);
      throw error;
    }
  },

  // Handles entry bulk generation for setup configurations
  bulkCreate: async (dataArray) => {
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

  // Handles updating existing inputs (e.g., .update(id, record))
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

  // Handles removal actions (e.g., .delete(recordId))
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
