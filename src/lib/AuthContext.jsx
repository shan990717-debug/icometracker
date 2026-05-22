import React, { createContext, useContext, useEffect, useState } from 'react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut, 
  createUserWithEmailAndPassword 
} from 'firebase/auth';
import { queryClientInstance } from '@/lib/query-client'; // Import the global react-query client

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(true);
  const [authError, setAuthError] = useState(null);

  const navigateToLogin = () => {
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoadingAuth(false);
      setIsLoadingPublicSettings(false); 
    }, (error) => {
      console.error(error);
      setAuthError({ type: 'auth_failed', message: error.message });
      setIsLoadingAuth(false);
      setIsLoadingPublicSettings(false);
    });
    return unsubscribe;
  }, []);

  const login = (email, password) => {
    // Completely flush out React Query cache memory before validating credentials
    queryClientInstance.clear();
    return signInWithEmailAndPassword(auth, email, password);
  };

  // 🛡️ THE BULLETPROOF FIXED LOGOUT SEQUENCE
  const logout = async () => {
    try {
      // 1. Immediately wipe all local React Query memory states
      queryClientInstance.clear();
      window.localStorage.clear();
      window.sessionStorage.clear();

      // 2. Use the official Firebase signOut function instead of base44!
      await signOut(auth);
      
      // 3. Clear context parameters cleanly
      setUser(null);
      setAuthError(null);
    } catch (error) {
      console.error("Firebase logout processing execution error:", error);
    } finally {
      // 4. Forces the state loader to stay quiet so App.jsx never hides the view behind a spinner
      setIsLoadingAuth(false);
      setIsLoadingPublicSettings(false);

      // 5. Hard bounce straight out to the root window landing screen
      window.location.replace(window.location.origin);
    }
  };

  const signup = (email, password) => {
    queryClientInstance.clear();
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const value = {
    user,
    isLoadingAuth,
    isLoadingPublicSettings,
    authError,
    navigateToLogin,
    login,
    logout,
    signup
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
