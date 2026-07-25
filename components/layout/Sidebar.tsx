"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { toggleSidebar } from '../../store/slices/uiSlice';
import { setActiveSession, createNewSession } from '../../store/slices/chatSlice';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const sidebarOpen = useSelector((state: RootState) => state.ui.sidebarOpen);
  const { sessions, activeSessionId } = useSelector((state: RootState) => state.chat);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <aside className={`
      bg-surface-container-lowest dark:bg-inverse-surface 
      text-primary dark:text-inverse-primary 
      w-sidebar-width h-screen fixed left-0 top-0 
      border-r border-outline-variant dark:border-outline 
      flex flex-col h-full z-50 transition-transform duration-300
      ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      md:translate-x-0 md:flex
    `}>
      {/* Header / Brand */}
      <div className="p-4 border-b border-outline-variant flex items-center justify-between">
        <Link href="/dashboard/chat" className="flex items-center gap-3 cursor-pointer active:opacity-80 transition-all">
          <div className="w-8 h-8 rounded-[8px] bg-primary-container flex items-center justify-center text-on-primary-container">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
          </div>
          <div>
            <h1 className="text-headline-lg font-headline-lg text-primary dark:text-inverse-primary">AI Studio</h1>
            <span className="font-label-caps text-label-caps text-on-surface-variant">
              {(session?.user as any)?.role === 'admin' ? 'Admin Plan' : 'Pro Plan'}
            </span>
          </div>
        </Link>
        {/* Mobile close button */}
        <button className="md:hidden" onClick={() => dispatch(toggleSidebar())}>
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      {/* Search & New Chat Action */}
      <div className="p-4">
        <button 
          onClick={() => {
            const newSession = {
              id: `chat_${Date.now()}`,
              title: 'New Chat',
              lastUpdated: new Date().toISOString(),
              messages: []
            };
            dispatch(createNewSession(newSession));
            router.push('/dashboard/chat');
          }}
          className="w-full bg-primary text-on-primary rounded-[8px] py-2 px-4 flex items-center justify-center gap-2 hover:bg-surface-tint transition-colors cursor-pointer active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span className="font-body-sm text-body-sm font-semibold">New Chat</span>
        </button>
        <div className="mt-4 relative z-50">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
          <input 
            className="w-full bg-surface-container border border-outline-variant rounded-[8px] pl-9 pr-3 py-2 text-body-sm font-body-sm text-on-surface dark:text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder-on-surface-variant" 
            placeholder="Search chats..." 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
          />
          
          {/* Floating Search Suggestions */}
          {isSearchFocused && searchQuery && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-surface-container-high dark:bg-surface-container-highest border border-outline-variant rounded-[8px] shadow-lg max-h-60 overflow-y-auto z-50">
              {sessions.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase())).length > 0 ? (
                sessions
                  .filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(session => (
                    <button
                      key={session.id}
                      onClick={() => {
                        dispatch(setActiveSession(session.id));
                        router.push('/dashboard/chat');
                        setSearchQuery('');
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-surface-container-highest dark:hover:bg-surface-tint/20 flex items-center gap-2 border-b border-outline-variant/30 last:border-0"
                    >
                      <span className="material-symbols-outlined text-[16px] text-on-surface-variant">chat_bubble_outline</span>
                      <span className="truncate text-sm text-on-surface dark:text-white">{session.title}</span>
                    </button>
                  ))
              ) : (
                <div className="px-4 py-3 text-sm text-on-surface-variant italic text-center">No matching chats</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="flex-1 overflow-y-auto hide-scrollbar py-2">
        <div className="px-2 space-y-1 mb-6">
          <Link href="/dashboard/chats" className="px-4 py-2 text-xs font-bold text-on-surface-variant dark:text-outline-variant hover:text-on-surface dark:hover:text-white transition-colors uppercase tracking-wider cursor-pointer block flex items-center justify-between group">
            <span>Recent Chats</span>
            <span className="material-symbols-outlined text-[14px] opacity-0 group-hover:opacity-100 transition-opacity">open_in_new</span>
          </Link>
          
          {sessions
            .filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()))
            .slice(0, 3)
            .map(session => (
              <button
                key={session.id}
                onClick={() => {
                  dispatch(setActiveSession(session.id));
                  router.push('/dashboard/chat');
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-[8px] cursor-pointer transition-all border-l-4 text-left ${isActive('/dashboard/chat') && activeSessionId === session.id ? 'bg-secondary-container text-on-secondary-container border-primary rounded-r-[8px]' : 'text-on-surface-variant dark:text-outline-variant hover:bg-surface-container-high dark:hover:bg-surface-tint/50 border-transparent hover:border-outline-variant dark:hover:border-outline'}`}
              >
                <span className="material-symbols-outlined text-[18px]">chat_bubble_outline</span>
                <span className="flex-1 truncate">{session.title}</span>
              </button>
            ))
          }
          
          {sessions.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
            <div className="px-4 py-2 text-sm text-on-surface-variant italic">No chats found.</div>
          )}
        </div>

        <div className="px-2 space-y-1">
          <div className="px-4 py-2 text-xs font-bold text-on-surface-variant dark:text-outline-variant uppercase tracking-wider">
            Dashboard
          </div>
          <Link href="/dashboard/billing" className={`flex items-center gap-3 px-4 py-3 rounded-[8px] cursor-pointer transition-all border-l-4 ${isActive('/dashboard/billing') ? 'bg-secondary-container text-on-secondary-container border-primary rounded-r-[8px]' : 'text-on-surface-variant dark:text-outline-variant hover:bg-surface-container-high dark:hover:bg-surface-tint/50 border-transparent hover:border-outline-variant dark:hover:border-outline'}`}>
            <span className="material-symbols-outlined">bar_chart</span>
            <span className="flex-1 truncate">Usage Statistics</span>
          </Link>
          <Link href="/dashboard/settings" className={`flex items-center gap-3 px-4 py-3 rounded-[8px] cursor-pointer transition-all border-l-4 ${isActive('/dashboard/settings') ? 'bg-secondary-container text-on-secondary-container border-primary rounded-r-[8px]' : 'text-on-surface-variant dark:text-outline-variant hover:bg-surface-container-high dark:hover:bg-surface-tint/50 border-transparent hover:border-outline-variant dark:hover:border-outline'}`}>
            <span className="material-symbols-outlined">settings</span>
            <span className="flex-1 truncate">Settings</span>
          </Link>
          <Link href="/dashboard/help" className={`flex items-center gap-3 px-4 py-3 rounded-[8px] cursor-pointer transition-all border-l-4 ${isActive('/dashboard/help') ? 'bg-secondary-container text-on-secondary-container border-primary rounded-r-[8px]' : 'text-on-surface-variant dark:text-outline-variant hover:bg-surface-container-high dark:hover:bg-surface-tint/50 border-transparent hover:border-outline-variant dark:hover:border-outline'}`}>
            <span className="material-symbols-outlined">help</span>
            <span className="flex-1 truncate">Help Center</span>
          </Link>

        </div>
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-outline-variant space-y-1">
        {(session?.user as any)?.role === 'admin' && (
          <Link href="/admin" className="flex items-center gap-3 px-4 py-2 text-primary hover:bg-surface-container-high transition-colors duration-200 rounded-[8px] cursor-pointer active:opacity-80 mb-2 border border-primary/30">
            <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
            <span className="font-body-sm text-body-sm font-bold flex-1 truncate">Admin Console</span>
          </Link>
        )}
        <Link href="/dashboard/profile" className="flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:text-on-surface dark:text-outline-variant dark:hover:text-white hover:bg-surface-container-high dark:hover:bg-surface-tint/50 transition-colors duration-200 rounded-[8px] cursor-pointer active:opacity-80">
          <div className="w-6 h-6 rounded-[8px] bg-primary flex items-center justify-center text-white font-bold">
            {session?.user?.name?.[0] || 'U'}
          </div>
          <span className="font-body-sm text-body-sm flex-1 truncate">{session?.user?.name || 'Profile'}</span>
        </Link>
        <button onClick={() => signOut({ callbackUrl: '/login' })} className="w-full flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:text-on-surface dark:text-outline-variant dark:hover:text-white hover:bg-surface-container-high dark:hover:bg-surface-tint/50 transition-colors duration-200 rounded-[8px] cursor-pointer active:opacity-80">
          <span className="material-symbols-outlined">logout</span>
          <span className="font-body-sm text-body-sm">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
