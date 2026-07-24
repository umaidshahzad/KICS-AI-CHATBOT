"use client";

import { useState, useRef, useEffect } from 'react';

export default function ProfilePage() {
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState({
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'Administrator',
    timezone: 'UTC',
    avatar: '' // Empty means default initials
  });

  useEffect(() => {
    // Load avatar from localStorage on mount
    const savedAvatar = localStorage.getItem('adminAvatar');
    if (savedAvatar) {
      setProfile(prev => ({ ...prev, avatar: savedAvatar }));
    }
  }, []);

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

  const updateAvatar = (avatarData: string) => {
    setProfile(prev => ({ ...prev, avatar: avatarData }));
    if (avatarData) {
      localStorage.setItem('adminAvatar', avatarData);
    } else {
      localStorage.removeItem('adminAvatar');
    }
    // Dispatch event so other components (like AdminHeader) can update
    window.dispatchEvent(new Event('adminAvatarChanged'));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          updateAvatar(event.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-container-max mx-auto pb-8">
      {/* Header Area */}
      <div className="mb-10 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h2 className="font-headline-xl text-headline-xl font-bold text-primary mb-2 tracking-tight">Admin Profile</h2>
          <p className="text-on-surface-variant font-body-lg text-body-lg">Manage your personal information and account settings.</p>
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm max-w-3xl">
        <div className="p-6 md:p-8">
          <form onSubmit={handleSave} className="space-y-8">
            
            {/* Avatar Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 border-b border-outline-variant pb-8">
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <div className="w-24 h-24 rounded-full bg-surface-container-highest border-2 border-outline-variant overflow-hidden flex justify-center items-center font-bold text-3xl text-on-surface-variant relative z-10 group-hover:border-primary transition-colors">
                  {profile.avatar ? (
                    <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    profile.name.substring(0, 2).toUpperCase()
                  )}
                </div>
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  <span className="material-symbols-outlined text-white">photo_camera</span>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
              <div>
                <h3 className="font-headline-md text-primary mb-1">Profile Picture</h3>
                <p className="text-on-surface-variant text-sm mb-3">Click on the image to upload a new avatar. Recommended size: 256x256px.</p>
                <div className="flex gap-3">
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 py-1.5 border border-outline-variant text-on-surface rounded font-label-md text-sm hover:bg-surface-container-high transition-colors">
                    Upload New
                  </button>
                  {profile.avatar && (
                    <button type="button" onClick={() => updateAvatar('')} className="px-4 py-1.5 text-error font-label-md text-sm hover:bg-error-container hover:rounded transition-colors">
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div>
              <h3 className="font-headline-md text-primary mb-4 border-b border-outline-variant pb-2">Personal Information</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={profile.name}
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                      className="w-full px-4 py-2 bg-surface-container-low border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-[8px] font-body-sm outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={profile.email}
                      onChange={(e) => setProfile({...profile, email: e.target.value})}
                      className="w-full px-4 py-2 bg-surface-container-low border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-[8px] font-body-sm outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Role</label>
                    <input 
                      type="text" 
                      value={profile.role}
                      disabled
                      className="w-full px-4 py-2 bg-surface-container-high border border-outline-variant rounded-[8px] font-body-sm outline-none text-on-surface-variant cursor-not-allowed opacity-70"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Timezone</label>
                    <select 
                      value={profile.timezone}
                      onChange={(e) => setProfile({...profile, timezone: e.target.value})}
                      className="w-full px-4 py-2 bg-surface-container-low border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-[8px] font-body-sm outline-none transition-all"
                    >
                      <option value="UTC">UTC (GMT+0)</option>
                      <option value="EST">Eastern Time (EST)</option>
                      <option value="PST">Pacific Time (PST)</option>
                      <option value="IST">India Standard Time (IST)</option>
                    </select>
                  </div>
                </div>
              </div>
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
                  <><span className="material-symbols-outlined text-[18px]">save</span> Save Profile</>
                )}
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
}
