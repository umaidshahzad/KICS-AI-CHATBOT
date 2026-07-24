"use client";

import { useState } from 'react';

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [settings, setSettings] = useState({
    siteName: 'AI Console',
    supportEmail: 'support@example.com',
    allowSignups: true,
    requireApproval: true,
    defaultApiLimit: 100000,
    maintenanceMode: false
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1200);
  };

  return (
    <div className="max-w-container-max mx-auto pb-8">
      {/* Header Area */}
      <div className="mb-10 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h2 className="font-headline-xl text-headline-xl font-bold text-primary mb-2 tracking-tight">Platform Settings</h2>
          <p className="text-on-surface-variant font-body-lg text-body-lg">Configure global platform behavior and access controls.</p>
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm max-w-3xl">
        <div className="p-6 md:p-8">
          <form onSubmit={handleSave} className="space-y-8">
            
            {/* General Settings */}
            <div>
              <h3 className="font-headline-md text-primary mb-4 border-b border-outline-variant pb-2">General Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Site Name</label>
                  <input 
                    type="text" 
                    value={settings.siteName}
                    onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                    className="w-full md:w-2/3 px-4 py-2 bg-surface-container-low border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-[8px] font-body-sm outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Support Email</label>
                  <input 
                    type="email" 
                    value={settings.supportEmail}
                    onChange={(e) => setSettings({...settings, supportEmail: e.target.value})}
                    className="w-full md:w-2/3 px-4 py-2 bg-surface-container-low border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-[8px] font-body-sm outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Access Controls */}
            <div>
              <h3 className="font-headline-md text-primary mb-4 border-b border-outline-variant pb-2">Access & Security</h3>
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-10 h-5 rounded-full flex items-center p-1 transition-colors ${settings.allowSignups ? 'bg-primary' : 'bg-outline-variant'}`}>
                    <div className={`w-3.5 h-3.5 rounded-full bg-surface-container-lowest transform transition-transform ${settings.allowSignups ? 'translate-x-5' : ''}`}></div>
                  </div>
                  <input 
                    type="checkbox" 
                    className="hidden" 
                    checked={settings.allowSignups} 
                    onChange={(e) => setSettings({...settings, allowSignups: e.target.checked})}
                  />
                  <span className="font-body-sm text-on-surface group-hover:text-primary transition-colors">Allow new user signups</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-10 h-5 rounded-full flex items-center p-1 transition-colors ${settings.requireApproval ? 'bg-primary' : 'bg-outline-variant'}`}>
                    <div className={`w-3.5 h-3.5 rounded-full bg-surface-container-lowest transform transition-transform ${settings.requireApproval ? 'translate-x-5' : ''}`}></div>
                  </div>
                  <input 
                    type="checkbox" 
                    className="hidden" 
                    checked={settings.requireApproval} 
                    onChange={(e) => setSettings({...settings, requireApproval: e.target.checked})}
                  />
                  <span className="font-body-sm text-on-surface group-hover:text-primary transition-colors">Require admin approval for new accounts</span>
                </label>
              </div>
            </div>

            {/* Defaults */}
            <div>
              <h3 className="font-headline-md text-primary mb-4 border-b border-outline-variant pb-2">Platform Defaults</h3>
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Default API Token Limit (Free Tier)</label>
                <input 
                  type="number" 
                  value={settings.defaultApiLimit}
                  onChange={(e) => setSettings({...settings, defaultApiLimit: parseInt(e.target.value) || 0})}
                  className="w-full md:w-1/3 px-4 py-2 bg-surface-container-low border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-[8px] font-body-sm outline-none transition-all"
                />
              </div>
            </div>

            {/* Danger Zone */}
            <div>
              <h3 className="font-headline-md text-error mb-4 border-b border-error/30 pb-2">Danger Zone</h3>
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-10 h-5 rounded-full flex items-center p-1 transition-colors ${settings.maintenanceMode ? 'bg-error' : 'bg-outline-variant'}`}>
                  <div className={`w-3.5 h-3.5 rounded-full bg-surface-container-lowest transform transition-transform ${settings.maintenanceMode ? 'translate-x-5' : ''}`}></div>
                </div>
                <input 
                  type="checkbox" 
                  className="hidden" 
                  checked={settings.maintenanceMode} 
                  onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked})}
                />
                <span className={`font-body-sm transition-colors ${settings.maintenanceMode ? 'text-error font-bold' : 'text-on-surface group-hover:text-error'}`}>
                  Enable Maintenance Mode (Restricts access to admins only)
                </span>
              </label>
            </div>

            <div className="pt-6 border-t border-outline-variant flex justify-end">
              <button 
                type="submit"
                disabled={isSaving || saveSuccess}
                className="px-6 py-2.5 bg-primary text-on-primary rounded-[8px] font-label-md text-label-md hover:bg-surface-tint transition-colors cursor-pointer flex items-center justify-center gap-2 min-w-[140px]"
              >
                {isSaving ? (
                  <><span className="material-symbols-outlined text-[18px] animate-spin">sync</span> Saving...</>
                ) : saveSuccess ? (
                  <><span className="material-symbols-outlined text-[18px]">check</span> Saved</>
                ) : (
                  <><span className="material-symbols-outlined text-[18px]">save</span> Save Settings</>
                )}
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
}
