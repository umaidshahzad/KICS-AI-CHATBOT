"use client";

import { useEffect, useState, useRef } from 'react';
import { UserService } from '../../../services/user.service';
import { useSession } from 'next-auth/react';

export default function ProfilePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<any>(null);
  
  const [isEditingName, setIsEditingName] = useState(false);
  const [name, setName] = useState('');
  
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [password, setPassword] = useState('');
  
  const [isSaving, setIsSaving] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadProfile() {
      if (!session?.user?.email) return;
      try {
        const data = await UserService.fetchProfile(session.user.email);
        setProfile(data);
        setName(data.name);
      } catch (err) {
        console.error(err);
      }
    }
    if (session) loadProfile();
  }, [session]);

  const handleSaveName = async () => {
    setIsSaving(true);
    try {
      const updated = await UserService.updateProfile({ id: profile.id, email: profile.email, name });
      setProfile(updated);
      setIsEditingName(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePassword = async () => {
    if (!password.trim()) return;
    setIsSaving(true);
    try {
      const updated = await UserService.updateProfile({ id: profile.id, email: profile.email, password });
      setProfile(updated);
      setIsEditingPassword(false);
      setPassword('');
      alert('Password updated successfully');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      const formData = new FormData();
      formData.append('id', profile.id);
      formData.append('email', profile.email);
      formData.append('avatar', file);

      try {
        const updated = await UserService.updateProfile(formData);
        setProfile(updated);
        // Dispatch event for sidebar and header to sync instantly
        window.dispatchEvent(new Event('userAvatarChanged'));
      } catch (err) {
        console.error("Failed to upload image", err);
      }
    }
  };

  if (!profile) return <div className="p-8">Loading profile...</div>;

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>
      
      <div className="bg-surface-container-lowest border border-outline-variant rounded-[16px] p-6">
        
        {/* Avatar Section */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-8 border-b border-outline-variant">
          <div 
            className="w-24 h-24 rounded-full bg-primary-container border-2 border-outline-variant overflow-hidden flex justify-center items-center font-bold text-3xl text-on-primary-container relative group cursor-pointer hover:border-primary transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            {profile.avatar ? (
              <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              profile.name.substring(0, 2).toUpperCase()
            )}
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
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
            <h2 className="text-2xl font-bold">{profile.name}</h2>
            <p className="text-on-surface-variant">{profile.email}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-secondary-container text-on-secondary-container rounded-[8px] text-xs font-bold uppercase tracking-wider">
              {profile.role} Plan
            </span>
          </div>
        </div>

        <div className="space-y-6">
          {/* Display Name */}
          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2 tracking-wider">Display Name</label>
            {isEditingName ? (
              <div className="flex gap-4">
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="flex-1 bg-surface-container border border-outline-variant rounded-[8px] px-4 py-2 outline-none focus:border-primary"
                  disabled={isSaving}
                />
                <button onClick={handleSaveName} disabled={isSaving} className="bg-primary text-white px-4 py-2 rounded-[8px] font-bold">Save</button>
                <button onClick={() => setIsEditingName(false)} disabled={isSaving} className="px-4 py-2 rounded-[8px] border border-outline-variant">Cancel</button>
              </div>
            ) : (
              <div className="flex justify-between items-center bg-surface-container rounded-[8px] p-4">
                <span className="font-medium">{profile.name}</span>
                <button onClick={() => setIsEditingName(true)} className="text-primary font-bold hover:underline">Edit</button>
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2 tracking-wider">Email Address</label>
            <div className="bg-surface-container rounded-[8px] p-4 opacity-70">
              <span>{profile.email}</span>
            </div>
            <p className="text-xs text-on-surface-variant mt-2 italic">Email cannot be changed.</p>
          </div>

          {/* Security */}
          <div className="pt-6 border-t border-outline-variant">
            <h3 className="font-bold text-lg mb-4">Security</h3>
            <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2 tracking-wider">Password</label>
            
            {isEditingPassword ? (
              <div className="flex gap-4">
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="Enter new password"
                  className="flex-1 bg-surface-container border border-outline-variant rounded-[8px] px-4 py-2 outline-none focus:border-primary"
                  disabled={isSaving}
                />
                <button onClick={handleSavePassword} disabled={isSaving || !password.trim()} className="bg-primary text-white px-4 py-2 rounded-[8px] font-bold">Save</button>
                <button onClick={() => setIsEditingPassword(false)} disabled={isSaving} className="px-4 py-2 rounded-[8px] border border-outline-variant">Cancel</button>
              </div>
            ) : (
              <div className="flex justify-between items-center bg-surface-container rounded-[8px] p-4">
                <span>••••••••••••</span>
                <button onClick={() => setIsEditingPassword(true)} className="text-primary font-bold hover:underline">
                  Change Password
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
