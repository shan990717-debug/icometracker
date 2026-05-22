import React from 'react';
import { base44 } from '@/api/base44Client';

export function LogoutButton() {
  const handleLogout = async () => {
    try {
      // 1. Terminate the cloud database connection session
      await base44.auth.logout();
    } catch (error) {
      console.error("Logout authentication processing error:", error);
    } finally {
      // 2. 🛡️ Clean out lingering frontend layout cache metrics
      window.localStorage.clear();
      window.sessionStorage.clear();

      // 3. Force the application back to a 100% fresh slate at the root entry path
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
