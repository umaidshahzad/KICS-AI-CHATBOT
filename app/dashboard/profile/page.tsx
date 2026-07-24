"use client";

import { useEffect, useState } from 'react';
import { UserService } from '../../../services/user.service';
import { useSession } from 'next-auth/react';

export default function ProfilePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  
  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await UserService.fetchProfile();
        setProfile(data);
        setName(data.name);
      } catch (err) {
        console.error(err);
      }
    }
    loadProfile();
  }, []);

  const handleSave = async () => {
    try {
      const updated = await UserService.updateProfile({ name });
      setProfile(updated);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (!profile) return <div className="p-8">Loading profile...</div>;

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>
      
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6">
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-outline-variant">
          <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white text-3xl font-bold">
            {profile.name[0]}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{profile.name}</h2>
            <p className="text-on-surface-variant">{profile.email}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-xs font-bold uppercase">
              {profile.role}
            </span>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2">Display Name</label>
            {isEditing ? (
              <div className="flex gap-4">
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="flex-1 bg-surface-container border border-outline-variant rounded-lg px-4 py-2 outline-none focus:border-primary"
                />
                <button onClick={handleSave} className="bg-primary text-white px-4 py-2 rounded-lg font-bold">Save</button>
                <button onClick={() => setIsEditing(false)} className="px-4 py-2 rounded-lg border border-outline-variant">Cancel</button>
              </div>
            ) : (
              <div className="flex justify-between items-center bg-surface-container rounded-lg p-4">
                <span>{profile.name}</span>
                <button onClick={() => setIsEditing(true)} className="text-primary font-bold">Edit</button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2">Email Address</label>
            <div className="bg-surface-container rounded-lg p-4 opacity-70">
              <span>{profile.email}</span>
            </div>
            <p className="text-xs text-on-surface-variant mt-2">Email cannot be changed.</p>
          </div>

          <div className="pt-6 border-t border-outline-variant">
            <h3 className="font-bold text-lg mb-4">Security</h3>
            <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2">Password</label>
            <div className="flex justify-between items-center bg-surface-container rounded-lg p-4">
              <span>••••••••</span>
              <button 
                onClick={() => alert("Mock: Password change dialog would open here.")} 
                className="text-primary font-bold hover:underline"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
