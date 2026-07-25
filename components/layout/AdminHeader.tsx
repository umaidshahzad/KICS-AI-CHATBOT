"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { toggleSidebar } from '../../store/slices/uiSlice';
import { useState, useEffect } from 'react';

export function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const [modalContent, setModalContent] = useState<{title: string, message: string} | null>(null);
  
  const [avatar, setAvatar] = useState('');

  useEffect(() => {
    // Initial load
    setAvatar(localStorage.getItem('adminAvatar') || '');

    // Listen for changes from profile page
    const handleAvatarChange = () => {
      setAvatar(localStorage.getItem('adminAvatar') || '');
    };

    window.addEventListener('adminAvatarChanged', handleAvatarChange);
    return () => window.removeEventListener('adminAvatarChanged', handleAvatarChange);
  }, []);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const pages = [
    { name: 'Dashboard', path: '/admin', icon: 'dashboard' },
    { name: 'User Management', path: '/admin/users', icon: 'group' },
    { name: 'Access Requests', path: '/admin/requests', icon: 'how_to_reg' },
    { name: 'Models', path: '/admin/models', icon: 'smart_toy' },
    { name: 'Subscription Plans', path: '/admin/plans', icon: 'sell' },
    { name: 'API Usage', path: '/admin/api-usage', icon: 'data_usage' }
  ];

  const filteredPages = pages.filter(page => 
    page.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <header className="bg-surface h-16 w-full fixed top-0 md:absolute z-40 border-b border-outline-variant flex items-center justify-between px-4 lg:px-8 transition-colors">
        <div className="flex items-center gap-2 lg:gap-6 min-w-0">
          <button className="md:hidden mr-2 cursor-pointer" onClick={() => dispatch(toggleSidebar())}>
            <span className="material-symbols-outlined">menu</span>
          </button>
          <h1 className="font-headline-lg text-headline-lg font-bold text-on-background whitespace-nowrap hidden sm:block">AI Console</h1>
          <h1 className="font-headline-lg text-headline-lg font-bold text-on-background sm:hidden">AI</h1>
          
          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-6 ml-2 overflow-x-auto hide-scrollbar flex-shrink-0">
            <Link href="/admin" className={`${pathname === '/admin' ? 'text-primary font-bold border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-on-surface hover:text-primary'} font-body-sm text-body-sm cursor-pointer active:scale-95 transition-transform whitespace-nowrap`}>
              Dashboard
            </Link>
            <Link href="/admin/users" className={`${pathname.includes('/admin/users') ? 'text-primary font-bold border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-on-surface hover:text-primary'} font-body-sm text-body-sm cursor-pointer active:scale-95 transition-transform whitespace-nowrap`}>
              Users
            </Link>
            <Link href="/admin/models" className={`${pathname.includes('/admin/models') ? 'text-primary font-bold border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-on-surface hover:text-primary'} font-body-sm text-body-sm cursor-pointer active:scale-95 transition-transform whitespace-nowrap`}>
              Models
            </Link>
            <Link href="/admin/plans" className={`${pathname.includes('/admin/plans') ? 'text-primary font-bold border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-on-surface hover:text-primary'} font-body-sm text-body-sm cursor-pointer active:scale-95 transition-transform whitespace-nowrap`}>
              Billing
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2 lg:gap-4 flex-shrink-0">
          {/* Search Bar */}
          <div className="relative hidden xl:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
            <input 
              className="pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-DEFAULT focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow font-body-sm text-body-sm text-on-surface w-48 lg:w-64 placeholder-outline" 
              placeholder="Search pages..." 
              type="text" 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            />
            
            {showSuggestions && searchQuery.trim() !== '' && (
              <div className="absolute top-full mt-2 w-full bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg overflow-hidden z-50">
                {filteredPages.length > 0 ? (
                  <ul className="py-2">
                    {filteredPages.map((page, index) => (
                      <li key={index}>
                        <div 
                          className="flex items-center gap-3 px-4 py-2 hover:bg-surface-container-high transition-colors text-on-surface font-body-sm cursor-pointer"
                          onMouseDown={(e) => {
                            // Prevent input blur
                            e.preventDefault();
                            setSearchQuery('');
                            setShowSuggestions(false);
                            router.push(page.path);
                          }}
                        >
                          <span className="material-symbols-outlined text-outline text-[18px]">{page.icon}</span>
                          {page.name}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-4 text-center text-on-surface-variant font-body-sm">
                    No matching pages found
                  </div>
                )}
              </div>
            )}
          </div>
          
          <Link 
            href="/admin/notifications"
            className="text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center w-8 h-8 rounded-full hover:bg-surface-container-high cursor-pointer"
          >
            <span className="material-symbols-outlined">notifications</span>
          </Link>

          
          {/* Actions */}
          <button 
            onClick={() => setModalContent({ title: 'Support', message: 'Contact us at support@example.com for any administrative help.' })}
            className="hidden lg:flex items-center gap-2 px-4 py-2 text-secondary font-body-sm text-body-sm border border-secondary rounded-DEFAULT hover:bg-secondary hover:text-on-secondary transition-colors cursor-pointer whitespace-nowrap"
          >
            Support
          </button>
          
          {/* Profile */}
          <Link 
            href="/admin/profile"
            className="w-8 h-8 rounded-full bg-surface-container-highest border border-outline-variant overflow-hidden cursor-pointer flex-shrink-0 flex justify-center items-center font-bold text-sm text-on-surface-variant hover:border-primary transition-colors relative"
          >
            {avatar ? (
              <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              'AD'
            )}
          </Link>
        </div>
      </header>

      {/* Global Modals for Header */}
      {modalContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg max-w-sm w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="font-headline-lg text-primary mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined">info</span>
              {modalContent.title}
            </h3>
            <p className="text-on-surface-variant font-body-md text-body-md mb-6">{modalContent.message}</p>
            <div className="flex justify-end">
              <button 
                onClick={() => setModalContent(null)}
                className="px-6 py-2 bg-primary text-on-primary rounded-[8px] font-label-md text-label-md hover:bg-surface-tint transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
