import React from 'react';
import { useQueryClient } from '@tanstack/react-query'; // 🛠️ Make sure this is imported!
import { base44 } from '@/api/base44Client';

export function LogoutButton() {
  const queryClient = useQueryClient(); // 🛠️ Initialize the query client

  const handleLogout = async () => {
    try {
      // 1. 🛡️ ERASES ALL CURRENT DATA FROM THE BROWSER CACHE INSTANTLY
      queryClient.clear(); 

      // 2. Clear out the active database session tokens
      await base44.auth.logout();

      // 3. Force the window to hard-reload straight back to the root entry path
      window.location.replace(window.location.origin);
    } catch (error) {
      console.error("Logout failed:", error);
      window.location.replace('/');
    }
  };

  return (
    <button 
      onClick={handleLogout}
      className="w-full h-10 rounded-xl font-semibold flex items-center justify-center gap-2 bg-destructive text-destructive-foreground hover:bg-destructive/90"
    >
      Sign Out
    </button>
  );
}
