"use client";

export default function SettingsPage() {
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
            <button className="w-12 h-6 bg-surface-container border border-outline-variant rounded-full relative">
              <div className="w-4 h-4 bg-primary rounded-full absolute left-1 top-1"></div>
            </button>
          </div>
          
          <div className="flex items-center justify-between py-4 border-b border-outline-variant">
            <div>
              <h3 className="font-bold">Language</h3>
              <p className="text-sm text-on-surface-variant">Select your preferred language.</p>
            </div>
            <select className="bg-surface-container border border-outline-variant rounded-lg px-4 py-2 outline-none">
              <option>English</option>
              <option>Spanish</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
