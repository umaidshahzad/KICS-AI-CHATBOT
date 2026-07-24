"use client";

import { useDispatch } from 'react-redux';
import { toggleSidebar } from '../../store/slices/uiSlice';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export function SuperAdminHeader() {
  const dispatch = useDispatch();
  const [showProfile, setShowProfile] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    const loadAvatar = () => {
      setAvatar(localStorage.getItem('superadmin_avatar'));
    };
    loadAvatar();
    window.addEventListener('storage', loadAvatar);
    return () => window.removeEventListener('storage', loadAvatar);
  }, []);
  
  return (
    <header className="h-16 bg-surface-container-lowest border-b border-outline-variant flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => dispatch(toggleSidebar())}
          className="md:hidden text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>
        <div className="font-headline-sm font-bold text-primary hidden md:block">
          System Overview
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4 relative">
        {/* Profile */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowProfile(!showProfile);
            }}
            className="w-8 h-8 rounded-full bg-primary text-on-primary overflow-hidden cursor-pointer flex-shrink-0 flex justify-center items-center font-bold text-sm ml-2 hover:opacity-90 border border-outline-variant"
          >
            {avatar ? (
              <img src={avatar} alt="SA" className="w-full h-full object-cover" />
            ) : (
              "SA"
            )}
          </button>
          
          {showProfile && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowProfile(false)}></div>
              <div className="absolute right-0 mt-2 w-48 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg p-2 z-50">
                <div className="p-2 border-b border-outline-variant mb-1">
                  <p className="font-label-md font-bold text-on-surface">Super Admin</p>
                  <p className="font-body-sm text-on-surface-variant text-xs">superadmin@example.com</p>
                </div>
                <Link href="/superadmin/profile" className="flex items-center gap-2 w-full text-left p-2 hover:bg-surface-container rounded-lg text-on-surface font-label-md transition-colors mb-1">
                  <span className="material-symbols-outlined text-[18px]">person</span>
                  Profile
                </Link>
                <Link href="/api/auth/signout" className="flex items-center gap-2 w-full text-left p-2 hover:bg-error-container rounded-lg text-error font-label-md transition-colors">
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  Sign Out
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
