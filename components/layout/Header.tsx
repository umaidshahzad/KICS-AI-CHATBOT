"use client";

import { useDispatch } from 'react-redux';
import { toggleSidebar } from '../../store/slices/uiSlice';
import { useSession } from 'next-auth/react';

export function Header() {
  const dispatch = useDispatch();
  const { data: session } = useSession();

  return (
    <header className="md:hidden bg-surface border-b border-outline-variant h-16 flex items-center justify-between px-4 z-40 fixed top-0 w-full">
      <div className="flex items-center gap-2">
        <button onClick={() => dispatch(toggleSidebar())} className="text-on-surface">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <span className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-on-background">
          AI Console
        </span>
      </div>
      <button className="w-8 h-8 rounded-[8px] overflow-hidden border border-outline-variant bg-primary text-white font-bold flex items-center justify-center">
        {session?.user?.name?.[0] || 'U'}
      </button>
    </header>
  );
}
