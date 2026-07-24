"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SuperAdminProfilePage() {
  const [profile, setProfile] = useState({
    name: 'Super Admin',
    email: 'superadmin@example.com',
    role: 'System Administrator',
    bio: 'Overseeing global infrastructure and security operations.'
  });

  const [avatar, setAvatar] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  // Load avatar from localStorage on mount
  useEffect(() => {
    const savedAvatar = localStorage.getItem('superadmin_avatar');
    if (savedAvatar) {
      setAvatar(savedAvatar);
    }
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setAvatar(base64String);
        localStorage.setItem('superadmin_avatar', base64String);
        window.dispatchEvent(new Event('storage'));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Saving changes...');
    setTimeout(() => {
      setStatus('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setStatus(null), 3000);
    }, 1000);
  };

  return (
    <div className="max-w-[1000px] mx-auto w-full flex-1 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <Link href="/superadmin" className="text-primary hover:underline font-label-md flex items-center gap-1 mb-2">
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Back to Overview
        </Link>
        <div className="flex justify-between items-center">
          <h2 className="font-headline-xl text-3xl md:text-4xl font-bold text-on-surface">My Profile</h2>
          {!isEditing && (
            <button 
              onClick={() => setIsEditing(true)}
              className="bg-primary text-on-primary px-4 py-2 rounded-lg font-label-md hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">edit</span>
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden p-8 flex flex-col md:flex-row gap-8">
        
        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-4 border-r border-outline-variant pr-8 min-w-[250px]">
          <div className="w-40 h-40 rounded-full bg-surface-container-highest border-4 border-outline-variant flex items-center justify-center overflow-hidden text-5xl font-bold text-primary relative group">
            {avatar ? (
              <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span>SA</span>
            )}
            
            {isEditing && (
              <label className="absolute inset-0 bg-black/60 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                <span className="material-symbols-outlined text-3xl mb-1">photo_camera</span>
                <span className="font-label-sm font-bold">Change Photo</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            )}
          </div>
          <div className="text-center">
            <h3 className="font-headline-sm font-bold text-on-surface">{profile.name}</h3>
            <p className="font-label-md text-primary mt-1">{profile.role}</p>
          </div>
        </div>

        {/* Form Section */}
        <div className="flex-1">
          <form onSubmit={handleSave} className="space-y-6">
            
            {status && (
              <div className={`p-4 rounded-lg font-label-md font-bold ${status.includes('successfully') ? 'bg-green-100 text-green-800' : 'bg-surface-container text-primary animate-pulse'}`}>
                {status}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-label-sm font-bold text-on-surface-variant uppercase tracking-wider mb-2">Full Name</label>
                <input 
                  type="text" 
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  disabled={!isEditing}
                  className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-3 text-on-surface focus:outline-none focus:border-primary disabled:opacity-70 disabled:cursor-not-allowed" 
                />
              </div>
              <div>
                <label className="block font-label-sm font-bold text-on-surface-variant uppercase tracking-wider mb-2">Email Address</label>
                <input 
                  type="email" 
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                  disabled={!isEditing}
                  className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-3 text-on-surface focus:outline-none focus:border-primary disabled:opacity-70 disabled:cursor-not-allowed" 
                />
              </div>
            </div>

            <div>
              <label className="block font-label-sm font-bold text-on-surface-variant uppercase tracking-wider mb-2">Bio / Description</label>
              <textarea 
                value={profile.bio}
                onChange={(e) => setProfile({...profile, bio: e.target.value})}
                disabled={!isEditing}
                rows={4}
                className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-3 text-on-surface focus:outline-none focus:border-primary disabled:opacity-70 disabled:cursor-not-allowed resize-none" 
              />
            </div>

            {isEditing && (
              <div className="pt-6 border-t border-outline-variant flex justify-end gap-4">
                <button 
                  type="button" 
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2.5 font-label-md font-bold text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2.5 bg-primary text-on-primary font-label-md font-bold rounded-lg hover:bg-primary/90 shadow-sm transition-colors"
                >
                  Save Changes
                </button>
              </div>
            )}
          </form>
        </div>
        
      </div>
    </div>
  );
}
