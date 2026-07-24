"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar } from '../../store/slices/uiSlice';
import { RootState } from '../../store/store';
import { AuthService } from '../../services/auth.service';
import { useRouter } from 'next/navigation';

export function SuperAdminSidebar() {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();
  const isSidebarOpen = useSelector((state: RootState) => state.ui.isSidebarOpen);

  const handleLogout = async () => {
    await AuthService.logout();
    router.push('/login');
  };

  const navItems = [
    { name: 'Platform Overview', path: '/superadmin', icon: 'dashboard' },
    { name: 'Admin Management', path: '/superadmin/admins', icon: 'manage_accounts' },
    { name: 'Global Analytics', path: '/superadmin/analytics', icon: 'monitoring' },
    { name: 'Model Configuration', path: '/superadmin/models', icon: 'model_training' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => dispatch(toggleSidebar())}
        />
      )}

      {/* Sidebar */}
      <nav className={`
        fixed md:sticky top-0 left-0 h-screen w-[280px] 
        bg-surface-container-lowest border-r border-outline-variant
        flex flex-col z-50
        transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Header */}
        <div className="p-6 border-b border-outline-variant flex items-center justify-between md:block">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-xl">
              S
            </div>
            <div>
              <h1 className="font-headline-sm font-bold text-primary">Super Admin</h1>
              <p className="text-xs text-on-surface-variant uppercase tracking-wider font-bold">Control Center</p>
            </div>
          </div>
          <button 
            className="md:hidden text-on-surface-variant hover:text-primary"
            onClick={() => dispatch(toggleSidebar())}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-6">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <li key={item.path}>
                  <Link 
                    href={item.path}
                    onClick={() => {
                      if (window.innerWidth < 768) {
                        dispatch(toggleSidebar());
                      }
                    }}
                    className={`
                      flex items-center gap-3 px-6 py-3 transition-colors font-body-md
                      ${isActive 
                        ? 'bg-surface-container-high text-primary border-l-4 border-primary font-bold' 
                        : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface border-l-4 border-transparent'
                      }
                    `}
                  >
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                      {item.icon}
                    </span>
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-outline-variant">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-error hover:bg-error/10 transition-colors rounded-lg font-body-md"
          >
            <span className="material-symbols-outlined">logout</span>
            Sign Out
          </button>
        </div>
      </nav>
    </>
  );
}
