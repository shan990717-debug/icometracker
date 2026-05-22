import React from 'react';
import { useAuth } from '@/lib/AuthContext'; // 1. Import your auth context

export function LogoutButton() {
  const { logout } = useAuth(); // 2. Extract your official logout function

  const handleLogout = async () => {
    try {
      window.localStorage.clear();
      window.sessionStorage.clear();
      await logout(); // 3. Use Firebase logout instead of base44
    } catch (error) {
      console.error("Logout authentication processing error:", error);
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
