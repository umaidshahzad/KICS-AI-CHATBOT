"use client";

import { useState, useEffect } from 'react';

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  avatar?: string;
  lastLogin?: string;
};

export default function SuperAdminAdminsPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [activeFilter, setActiveFilter] = useState<'all' | 'active'>('all');

  const [showAddModal, setShowAddModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '', role: 'Admin' });
  const [addError, setAddError] = useState<string | null>(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editAdmin, setEditAdmin] = useState<AdminUser | null>(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await fetch('/api/mock/users');
      const data = await res.json();
      // Filter out regular users to only show admins
      const adminUsers = data.filter((u: any) => u.role !== 'user').map((u: any) => {
        let lastLoginText = 'Never';
        if (u.lastLogin) {
          const date = new Date(u.lastLogin);
          lastLoginText = isNaN(date.getTime()) ? 'Never' : date.toLocaleString('en-US', { 
            month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
          });
        }
        return {
          ...u,
          lastLogin: lastLoginText,
          status: u.status || 'active'
        };
      });
      setAdmins(adminUsers);
    } catch (error) {
      console.error('Failed to fetch admins', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError(null);
    if (!newAdmin.name || !newAdmin.email) return;

    try {
      const res = await fetch('/api/mock/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newAdmin.name,
          email: newAdmin.email,
          password: newAdmin.password,
          role: newAdmin.role,
          status: 'active'
        })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setAdmins([{ ...data, lastLogin: 'Never' }, ...admins]);
        setShowAddModal(false);
        setNewAdmin({ name: '', email: '', password: '', role: 'Admin' });
      } else {
        setAddError(data.error || 'Failed to add admin');
      }
    } catch (error) {
      console.error('Failed to add admin', error);
      setAddError('An unexpected error occurred');
    }
  };

  const handleDeactivate = async (id: string) => {
    const adminToUpdate = admins.find(a => a.id === id);
    if (!adminToUpdate) return;
    
    const newStatus = adminToUpdate.status?.toLowerCase() === 'active' ? 'inactive' : 'active';
    
    try {
      const res = await fetch('/api/mock/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });
      
      if (res.ok) {
        setAdmins(admins.map(admin => 
          admin.id === id ? { ...admin, status: newStatus } : admin
        ));
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating status');
    }
  };

  const handleUpdateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editAdmin) return;

    // Mocking a PUT request
    setAdmins(admins.map(admin => admin.id === editAdmin.id ? editAdmin : admin));
    setShowEditModal(false);
    setEditAdmin(null);
  };

  const handleDeleteAdmin = async (id: string) => {
    if (confirm('Are you sure you want to delete this admin?')) {
      try {
        const res = await fetch(`/api/mock/users?id=${id}`, { method: 'DELETE' });
        if (res.ok) {
          setAdmins(admins.filter(admin => admin.id !== id));
        } else {
          console.error('Failed to delete admin');
          alert('Failed to delete admin');
        }
      } catch (error) {
        console.error('Failed to delete admin', error);
      }
    }
  };

  const displayedAdmins = admins.filter(admin => {
    if (activeFilter === 'active') return admin.status?.toLowerCase() === 'active';
    return true;
  });

  return (
    <div className="max-w-[1440px] mx-auto w-full flex-1">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="font-headline-xl text-3xl md:text-4xl font-bold text-on-surface mb-2">Manage Administrators</h2>
          <p className="font-body-md text-on-surface-variant">View, edit, and control system access for all admin tiers.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-primary text-on-primary px-6 py-3 rounded-xl font-label-md hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          <span>Add New Admin</span>
        </button>
      </div>

      {/* Admin Table Card */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant">
        {/* Controls */}
        <div className="p-6 border-b border-outline-variant flex flex-col sm:flex-row justify-between items-center gap-4 bg-surface-container-low">
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-full font-label-sm font-bold border transition-colors ${activeFilter === 'all' ? 'bg-surface-container-highest text-on-surface border-outline-variant' : 'bg-surface text-on-surface-variant border-transparent hover:bg-surface-container'}`}
            >
              All Roles
            </button>
            <button 
              onClick={() => setActiveFilter('active')}
              className={`px-4 py-2 rounded-full font-label-sm font-bold border transition-colors ${activeFilter === 'active' ? 'bg-surface-container-highest text-on-surface border-outline-variant' : 'bg-surface text-on-surface-variant border-transparent hover:bg-surface-container'}`}
            >
              Active Only
            </button>
          </div>
          <button className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 font-label-sm font-bold">
            <span className="material-symbols-outlined text-[18px]">filter_list</span>
            <span>Filter</span>
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant bg-surface">
                <th className="py-4 px-6 font-label-sm text-on-surface-variant uppercase tracking-wider font-bold">Admin</th>
                <th className="py-4 px-6 font-label-sm text-on-surface-variant uppercase tracking-wider font-bold">Role</th>
                <th className="py-4 px-6 font-label-sm text-on-surface-variant uppercase tracking-wider font-bold">Status</th>
                <th className="py-4 px-6 font-label-sm text-on-surface-variant uppercase tracking-wider font-bold">Last Login</th>
                <th className="py-4 px-6 font-label-sm text-on-surface-variant uppercase tracking-wider font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {loading ? (
                <tr><td colSpan={5} className="text-center py-8 text-on-surface-variant">Loading admins...</td></tr>
              ) : displayedAdmins.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-on-surface-variant">No admins found.</td></tr>
              ) : displayedAdmins.map((admin) => (
                <tr key={admin.id} className="hover:bg-surface-container-low transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-primary font-bold overflow-hidden shrink-0 border border-outline-variant">
                        {admin.avatar ? (
                          <img src={admin.avatar} alt={admin.name} className="w-full h-full object-cover" />
                        ) : (
                          <span>{admin.name.split(' ').map(n => n[0]).join('')}</span>
                        )}
                      </div>
                      <div>
                        <div className="font-label-md text-on-surface font-bold">{admin.name}</div>
                        <div className="font-body-sm text-on-surface-variant mt-0.5 text-sm">{admin.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-label-sm bg-secondary-container text-on-secondary-container border border-secondary font-bold text-xs">
                      {admin.role}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${admin.status === 'Active' || admin.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="font-label-sm text-on-surface font-bold text-xs capitalize">{admin.status}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-body-sm text-on-surface-variant">
                    {admin.lastLogin}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => { setEditAdmin(admin); setShowEditModal(true); }}
                        className="p-1.5 text-on-surface-variant hover:text-primary rounded-md hover:bg-surface-container transition-colors" 
                        title="Edit Admin"
                      >
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                      </button>
                      <button 
                        onClick={() => handleDeactivate(admin.id)}
                        className={`p-1.5 text-on-surface-variant rounded-md transition-colors ${admin.status?.toLowerCase() === 'active' ? 'hover:text-error hover:bg-error-container' : 'hover:text-green-600 hover:bg-green-100'}`} 
                        title={admin.status?.toLowerCase() === 'active' ? 'Deactivate' : 'Activate'}
                      >
                        <span className="material-symbols-outlined text-[20px]">{admin.status?.toLowerCase() === 'active' ? 'block' : 'check_circle'}</span>
                      </button>
                      <button 
                        onClick={() => handleDeleteAdmin(admin.id)}
                        className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error-container rounded-md transition-colors ml-1" 
                        title="Delete Admin"
                      >
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Admin Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-outline-variant flex justify-between items-center">
              <h3 className="font-headline-md text-xl font-bold text-primary">Add New Admin</h3>
              <button onClick={() => setShowAddModal(false)} className="text-on-surface-variant hover:text-primary">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleAddAdmin} className="p-6 space-y-4">
              {addError && (
                <div className="p-3 rounded-lg bg-error-container text-error font-body-sm font-bold">
                  {addError}
                </div>
              )}
              <div>
                <label className="block font-label-sm font-bold text-on-surface-variant uppercase tracking-wider mb-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={newAdmin.name}
                  onChange={e => setNewAdmin({...newAdmin, name: e.target.value})}
                  className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2 text-on-surface focus:outline-none focus:border-primary"
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <label className="block font-label-sm font-bold text-on-surface-variant uppercase tracking-wider mb-1">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={newAdmin.email}
                  onChange={e => setNewAdmin({...newAdmin, email: e.target.value})}
                  className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2 text-on-surface focus:outline-none focus:border-primary"
                  placeholder="jane@example.com"
                />
              </div>
              <div>
                <label className="block font-label-sm font-bold text-on-surface-variant uppercase tracking-wider mb-1">Temporary Password</label>
                <input 
                  type="password" 
                  required
                  value={newAdmin.password}
                  onChange={e => setNewAdmin({...newAdmin, password: e.target.value})}
                  className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2 text-on-surface focus:outline-none focus:border-primary"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block font-label-sm font-bold text-on-surface-variant uppercase tracking-wider mb-1">Role</label>
                <select 
                  value={newAdmin.role}
                  onChange={e => setNewAdmin({...newAdmin, role: e.target.value})}
                  className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2 text-on-surface focus:outline-none focus:border-primary"
                >
                  <option>Admin</option>
                </select>
              </div>
              <div className="pt-4 flex gap-3 justify-end">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-on-surface-variant font-bold hover:bg-surface-container rounded-lg">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-primary text-on-primary font-bold rounded-lg hover:bg-primary/90">
                  Create Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Admin Modal */}
      {showEditModal && editAdmin && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-outline-variant flex justify-between items-center">
              <h3 className="font-headline-md text-xl font-bold text-primary">Edit Admin</h3>
              <button onClick={() => { setShowEditModal(false); setEditAdmin(null); }} className="text-on-surface-variant hover:text-primary">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleUpdateAdmin} className="p-6 space-y-4">
              <div>
                <label className="block font-label-sm font-bold text-on-surface-variant uppercase tracking-wider mb-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={editAdmin.name}
                  onChange={e => setEditAdmin({...editAdmin, name: e.target.value})}
                  className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2 text-on-surface focus:outline-none focus:border-primary"
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <label className="block font-label-sm font-bold text-on-surface-variant uppercase tracking-wider mb-1">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={editAdmin.email}
                  onChange={e => setEditAdmin({...editAdmin, email: e.target.value})}
                  className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2 text-on-surface focus:outline-none focus:border-primary"
                  placeholder="jane@example.com"
                />
              </div>
              <div>
                <label className="block font-label-sm font-bold text-on-surface-variant uppercase tracking-wider mb-1">Role</label>
                <select 
                  value={editAdmin.role}
                  onChange={e => setEditAdmin({...editAdmin, role: e.target.value})}
                  className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2 text-on-surface focus:outline-none focus:border-primary"
                >
                  <option>Admin</option>
                </select>
              </div>
              <div className="pt-4 flex gap-3 justify-end">
                <button type="button" onClick={() => { setShowEditModal(false); setEditAdmin(null); }} className="px-4 py-2 text-on-surface-variant font-bold hover:bg-surface-container rounded-lg">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-primary text-on-primary font-bold rounded-lg hover:bg-primary/90">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
