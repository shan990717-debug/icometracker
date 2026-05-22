import React from 'react';
import { base44 } from '@/api/base44Client';

export function LogoutButton() {
  const handleLogout = async () => {
    try {
      // 1. Terminate the active backend cloud session session cleanly
      await base44.auth.logout();
    } catch (error) {
      console.error("Logout backend execution error:", error);
    } finally {
      // 2. 🛡️ Absolute Memory Wipe: Clear all local storage records
      window.localStorage.clear();
      window.sessionStorage.clear();

      // 3. Force the browser to fully reload straight to the root login entry screen
      window.location.replace(window.location.origin);
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
