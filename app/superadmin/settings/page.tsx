"use client";

import { useState } from 'react';

export default function SuperAdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'billing'>('general');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('Saving...');
    setTimeout(() => {
      setSaveStatus('Settings saved successfully!');
      setTimeout(() => setSaveStatus(null), 3000);
    }, 1000);
  };

  return (
    <div className="max-w-[1440px] mx-auto w-full flex-1 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h2 className="font-headline-xl text-3xl md:text-4xl font-bold text-primary tracking-tight">System Settings</h2>
        <p className="font-body-lg text-lg text-on-surface-variant max-w-2xl">Configure global platform preferences, security policies, and billing details.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Settings Navigation */}
        <div className="lg:w-64 flex-shrink-0">
          <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            <button 
              onClick={() => setActiveTab('general')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-label-md font-bold transition-all text-left whitespace-nowrap ${activeTab === 'general' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'}`}
            >
              <span className="material-symbols-outlined text-[20px]">tune</span>
              General Preferences
            </button>
            <button 
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-label-md font-bold transition-all text-left whitespace-nowrap ${activeTab === 'security' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'}`}
            >
              <span className="material-symbols-outlined text-[20px]">security</span>
              Security & Auth
            </button>
            <button 
              onClick={() => setActiveTab('billing')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-label-md font-bold transition-all text-left whitespace-nowrap ${activeTab === 'billing' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'}`}
            >
              <span className="material-symbols-outlined text-[20px]">credit_card</span>
              Billing & Quotas
            </button>
          </nav>
        </div>

        {/* Settings Content */}
        <div className="flex-1 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
          <form onSubmit={handleSave} className="p-8 space-y-8">
            
            {activeTab === 'general' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <h3 className="font-headline-md text-xl font-bold text-primary mb-4 border-b border-outline-variant pb-2">General Preferences</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-label-sm font-bold text-on-surface-variant uppercase tracking-wider mb-2">Platform Name</label>
                    <input type="text" defaultValue="AI Studio Global" className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-3 text-on-surface focus:outline-none focus:border-primary transition-colors" />
                  </div>
                  <div>
                    <label className="block font-label-sm font-bold text-on-surface-variant uppercase tracking-wider mb-2">Support Email</label>
                    <input type="email" defaultValue="support@aistudio.corp" className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-3 text-on-surface focus:outline-none focus:border-primary transition-colors" />
                  </div>
                </div>

                <div>
                  <label className="block font-label-sm font-bold text-on-surface-variant uppercase tracking-wider mb-2">System Theme Default</label>
                  <select className="w-full md:w-1/2 bg-surface-container border border-outline-variant rounded-lg px-4 py-3 text-on-surface focus:outline-none focus:border-primary transition-colors">
                    <option>System Default (Auto)</option>
                    <option>Light Mode</option>
                    <option>Dark Mode</option>
                  </select>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <h3 className="font-headline-md text-xl font-bold text-primary mb-4 border-b border-outline-variant pb-2">Security & Authentication</h3>
                
                <div className="flex items-center justify-between p-4 border border-outline-variant rounded-xl bg-surface-container-low">
                  <div>
                    <p className="font-label-md font-bold text-on-surface">Require Two-Factor Authentication</p>
                    <p className="font-body-sm text-on-surface-variant mt-1">Enforce 2FA for all administrative accounts.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary transition-colors"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-outline-variant rounded-xl bg-surface-container-low">
                  <div>
                    <p className="font-label-md font-bold text-on-surface">Session Timeout</p>
                    <p className="font-body-sm text-on-surface-variant mt-1">Automatically log out inactive sessions.</p>
                  </div>
                  <select className="bg-surface-container border border-outline-variant rounded-lg px-3 py-2 text-on-surface text-sm font-bold focus:outline-none focus:border-primary">
                    <option>15 Minutes</option>
                    <option>30 Minutes</option>
                    <option>1 Hour</option>
                    <option>Never</option>
                  </select>
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <h3 className="font-headline-md text-xl font-bold text-primary mb-4 border-b border-outline-variant pb-2">Billing & Quotas</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-label-sm font-bold text-on-surface-variant uppercase tracking-wider mb-2">Default Free Tier Tokens</label>
                    <input type="number" defaultValue={50000} className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-3 text-on-surface focus:outline-none focus:border-primary transition-colors" />
                  </div>
                  <div>
                    <label className="block font-label-sm font-bold text-on-surface-variant uppercase tracking-wider mb-2">Global Rate Limit (Req/Min)</label>
                    <input type="number" defaultValue={1000} className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-3 text-on-surface focus:outline-none focus:border-primary transition-colors" />
                  </div>
                </div>

                <div className="p-4 bg-secondary-container/20 border border-secondary/30 rounded-xl">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-secondary">info</span>
                    <div>
                      <p className="font-label-md font-bold text-on-surface">Enterprise Billing Engine</p>
                      <p className="font-body-sm text-on-surface-variant mt-1">Changes to billing quotas take effect immediately and apply to all newly created organizations. Existing custom quotas will not be overridden.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="pt-6 border-t border-outline-variant flex items-center justify-end gap-4">
              {saveStatus && (
                <span className={`font-label-sm font-bold ${saveStatus.includes('success') ? 'text-green-600' : 'text-on-surface-variant'} animate-in fade-in`}>
                  {saveStatus}
                </span>
              )}
              <button type="button" className="px-6 py-2.5 font-label-md font-bold text-on-surface-variant hover:bg-surface-container rounded-xl transition-colors">
                Discard Changes
              </button>
              <button type="submit" className="px-6 py-2.5 bg-primary text-on-primary font-label-md font-bold rounded-xl hover:bg-primary/90 shadow-sm transition-colors flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">save</span>
                Save Configuration
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
