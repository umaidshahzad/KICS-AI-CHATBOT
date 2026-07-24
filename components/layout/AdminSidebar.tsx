"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { toggleSidebar } from '../../store/slices/uiSlice';

export function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const sidebarOpen = useSelector((state: RootState) => state.ui.sidebarOpen);

  const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

  return (
    <aside className={`
      bg-surface-container-lowest dark:bg-inverse-surface 
      text-primary dark:text-inverse-primary 
      w-64 h-screen fixed left-0 top-0 
      border-r border-outline-variant dark:border-outline 
      flex flex-col h-full z-50 transition-transform duration-300
      ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      md:translate-x-0 md:flex
    `}>
      {/* Header / Brand */}
      <div className="p-4 border-b border-outline-variant flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-3 cursor-pointer active:opacity-80 transition-all">
          <div className="w-8 h-8 rounded-[8px] bg-error flex items-center justify-center text-white">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>admin_panel_settings</span>
          </div>
          <div>
            <h1 className="text-headline-lg font-headline-lg text-primary dark:text-inverse-primary">AI Console</h1>
            <span className="font-label-caps text-label-caps text-on-surface-variant">
              Admin Workspace
            </span>
          </div>
        </Link>
        {/* Mobile close button */}
        <button className="md:hidden" onClick={() => dispatch(toggleSidebar())}>
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <nav className="flex-1 overflow-y-auto hide-scrollbar py-6">
        <div className="px-2 space-y-1">
          <p className="px-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Management</p>
          
          <Link href="/admin" className={`flex items-center gap-3 px-4 py-3 rounded-[8px] cursor-pointer transition-all border-l-4 ${pathname === '/admin' ? 'bg-secondary-container text-on-secondary-container border-primary rounded-r-[8px]' : 'text-on-surface-variant dark:text-outline-variant hover:bg-surface-container-high dark:hover:bg-surface-tint/50 border-transparent hover:border-outline-variant dark:hover:border-outline text-opacity-80 hover:text-opacity-100'}`}>
            <span className="material-symbols-outlined">space_dashboard</span>
            <span className="flex-1 truncate">Dashboard</span>
          </Link>
          
          <Link href="/admin/users" className={`flex items-center gap-3 px-4 py-3 rounded-[8px] cursor-pointer transition-all border-l-4 ${isActive('/admin/users') ? 'bg-secondary-container text-on-secondary-container border-primary rounded-r-[8px]' : 'text-on-surface-variant dark:text-outline-variant hover:bg-surface-container-high dark:hover:bg-surface-tint/50 border-transparent hover:border-outline-variant dark:hover:border-outline text-opacity-80 hover:text-opacity-100'}`}>
            <span className="material-symbols-outlined">group</span>
            <span className="flex-1 truncate">User Management</span>
          </Link>

          <Link href="/admin/requests" className={`flex items-center gap-3 px-4 py-3 rounded-[8px] cursor-pointer transition-all border-l-4 ${isActive('/admin/requests') ? 'bg-secondary-container text-on-secondary-container border-primary rounded-r-[8px]' : 'text-on-surface-variant dark:text-outline-variant hover:bg-surface-container-high dark:hover:bg-surface-tint/50 border-transparent hover:border-outline-variant dark:hover:border-outline text-opacity-80 hover:text-opacity-100'}`}>
            <span className="material-symbols-outlined">how_to_reg</span>
            <span className="flex-1 truncate">Access Requests</span>
            <span className="bg-error text-white text-xs font-bold px-2 py-0.5 rounded-full">2</span>
          </Link>

          <Link href="/admin/models" className={`flex items-center gap-3 px-4 py-3 rounded-[8px] cursor-pointer transition-all border-l-4 ${isActive('/admin/models') ? 'bg-secondary-container text-on-secondary-container border-primary rounded-r-[8px]' : 'text-on-surface-variant dark:text-outline-variant hover:bg-surface-container-high dark:hover:bg-surface-tint/50 border-transparent hover:border-outline-variant dark:hover:border-outline text-opacity-80 hover:text-opacity-100'}`}>
            <span className="material-symbols-outlined">smart_toy</span>
            <span className="flex-1 truncate">Models</span>
          </Link>

          <Link href="/admin/plans" className={`flex items-center gap-3 px-4 py-3 rounded-[8px] cursor-pointer transition-all border-l-4 ${isActive('/admin/plans') ? 'bg-secondary-container text-on-secondary-container border-primary rounded-r-[8px]' : 'text-on-surface-variant dark:text-outline-variant hover:bg-surface-container-high dark:hover:bg-surface-tint/50 border-transparent hover:border-outline-variant dark:hover:border-outline text-opacity-80 hover:text-opacity-100'}`}>
            <span className="material-symbols-outlined">loyalty</span>
            <span className="flex-1 truncate">Subscription Plans</span>
          </Link>

          <Link href="/admin/api-usage" className={`flex items-center gap-3 px-4 py-3 rounded-[8px] cursor-pointer transition-all border-l-4 ${isActive('/admin/api-usage') ? 'bg-secondary-container text-on-secondary-container border-primary rounded-r-[8px]' : 'text-on-surface-variant dark:text-outline-variant hover:bg-surface-container-high dark:hover:bg-surface-tint/50 border-transparent hover:border-outline-variant dark:hover:border-outline text-opacity-80 hover:text-opacity-100'}`}>
            <span className="material-symbols-outlined">api</span>
            <span className="flex-1 truncate">API Usage</span>
          </Link>

        </div>
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-outline-variant space-y-1">
        <Link href="/dashboard/chat" className="flex items-center gap-3 px-4 py-2 text-on-surface-variant dark:text-outline-variant hover:bg-surface-container-high dark:hover:bg-surface-tint/50 border border-transparent hover:border-outline-variant transition-colors duration-200 rounded-[8px] cursor-pointer active:opacity-80">
          <div className="w-6 h-6 rounded-[8px] bg-primary flex items-center justify-center text-white font-bold">
            <span className="material-symbols-outlined text-[16px]">smart_toy</span>
          </div>
          <span className="font-body-sm text-body-sm flex-1 truncate">Go to User Chat</span>
        </Link>
        <button onClick={() => signOut({ callbackUrl: '/login' })} className="w-full flex items-center gap-3 px-4 py-2 text-on-surface-variant dark:text-outline-variant hover:bg-surface-container-high dark:hover:bg-surface-tint/50 border border-transparent hover:border-outline-variant transition-colors duration-200 rounded-[8px] cursor-pointer active:opacity-80">
          <span className="material-symbols-outlined">logout</span>
          <span className="font-body-sm text-body-sm">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
