import React from 'react';
import { base44 } from '@/api/base44Client';

export function LogoutButton() {
  const handleLogout = async () => {
    try {
      // 1. Terminate the cloud session session cleanly
      await base44.auth.logout();
      
      // 2. 🛡️ THE PERFECT FIX: This natives clears ALL local caches, storage, and session records
      window.localStorage.clear();
      window.sessionStorage.clear();

      // 3. Force a hard native browser reload straight to her base URL domain
      window.location.replace(window.location.origin);
    } catch (error) {
      console.error("Logout execution error:", error);
      // Absolute fallback redirection sequence
      window.location.replace('/');
    }
  };

  return (
    <button 
      onClick={handleLogout}
      type="button"
      className="w-full h-10 rounded-xl font-bold flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white transition-all text-sm shadow-sm"
    >
      Sign Out / 退出登录
    </button>
  );
}
