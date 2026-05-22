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

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
const auth = getAuth(app);

const isUserLoggedOut = () => !auth.currentUser;

// Reusable model engine that routes ALL database actions directly to Firebase Firestore
const createFirebaseModel = (collectionName) => ({
  filter: async (conditions = {}) => {
    if (isUserLoggedOut()) return [];
    try {
      let q = collection(db, collectionName);
      Object.keys(conditions).forEach((key) => {
        if (conditions[key] !== undefined) {
          q = query(q, where(key, '==', conditions[key]));
        }
      });
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.warn(`Filter fallback for ${collectionName}:`, error.message);
      return [];
    }
  },

  list: async () => {
    if (isUserLoggedOut()) return [];
    try {
      const snapshot = await getDocs(collection(db, collectionName));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.warn(`List fallback for ${collectionName}:`, error.message);
      return [];
    }
  },

  get: async (id) => {
    if (!id || isUserLoggedOut()) return null;
    try {
      const snapshot = await getDocs(collection(db, collectionName));
      const found = snapshot.docs.find(d => d.id === id);
      return found ? { id: found.id, ...found.data() } : null;
    } catch (error) {
      return null;
    }
  },

  create: async (data) => {
    try {
      const docRef = await addDoc(collection(db, collectionName), data);
      return { id: docRef.id, ...data };
    } catch (error) {
      console.error(`Error creating in ${collectionName}:`, error);
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
      return dataArray;
    }
  },

  update: async (id, data) => {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, data);
      return { id, ...data };
    } catch (error) {
      console.error(`Error updating in ${collectionName}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error(`Error deleting in ${collectionName}:`, error);
      throw error;
    }
  }
});

// A Proxy wrapper that intercepts ANY table name requested by the code 
// and immediately wires it up to a working live Firestore instance!
export const entities = new Proxy({}, {
  get: (target, prop) => {
    if (!target[prop]) {
      target[prop] = createFirebaseModel(prop);
    }
    return target[prop];
  }
});

export const base44 = {
  db,
  entities,
  query: () => ({
    where: () => base44,
    order: () => base44,
    exec: async () => []
  })
};

const base44Client = {
  db,
  base44,
  entities,
  ...entities
};

export default base44Client;
