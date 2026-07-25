"use client";

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { setTheme } from '../../../store/slices/uiSlice';

export default function SettingsPage() {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.ui.theme);
  const isDarkMode = theme === 'dark';

  const toggleTheme = () => {
    dispatch(setTheme(isDarkMode ? 'light' : 'dark'));
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-4">Preferences</h2>
        <p className="text-on-surface-variant mb-6">Manage your general account preferences.</p>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between py-4 border-b border-outline-variant">
            <div>
              <h3 className="font-bold">Dark Mode</h3>
              <p className="text-sm text-on-surface-variant">Switch between light and dark themes.</p>
            </div>
            <button 
              onClick={toggleTheme}
              className={`w-12 h-6 rounded-full relative transition-colors duration-200 ${isDarkMode ? 'bg-primary' : 'bg-surface-container border border-outline-variant'}`}
            >
              <div 
                className={`w-4 h-4 rounded-full absolute top-1 transition-all duration-200 ${isDarkMode ? 'bg-white translate-x-7' : 'bg-primary translate-x-1'}`}
              ></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
