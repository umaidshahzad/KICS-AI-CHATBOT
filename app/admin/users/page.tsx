"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { AdminService } from '../../../services/admin.service';

export default function UserManagementPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal State
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingUser, setEditingUser] = useState<any>(null);
  
  // Filtering & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  
  // Form State
  const [formData, setFormData] = useState({ name: '', email: '', role: 'user', apiLimit: 100000, status: 'active' });
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const usersData = await AdminService.getUsers();
        setUsers(usersData);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const openAddModal = () => {
    setModalMode('create');
    setFormData({ name: '', email: '', role: 'user', apiLimit: 100000, status: 'active' });
    setFormError(null);
    setUserModalOpen(true);
  };

  const openEditModal = (user: any) => {
    setModalMode('edit');
    setEditingUser(user);
    setFormData({ 
      name: user.name, 
      email: user.email, 
      role: user.role, 
      apiLimit: user.apiLimit,
      status: user.status
    });
    setFormError(null);
    setUserModalOpen(true);
  };

  const handleSaveUser = async () => {
    setFormError(null);
    try {
      if (modalMode === 'create') {
        const newUser = await AdminService.createUserFromRequest(formData.name, formData.email);
        // Ensure role, limit, status match the form
        newUser.role = formData.role;
        newUser.apiLimit = formData.apiLimit;
        newUser.status = formData.status;
        setUsers([...users, newUser]);
      } else if (modalMode === 'edit' && editingUser) {
        const res = await fetch('/api/mock/admin/users', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingUser.id, ...formData })
        });
        
        if (res.ok) {
          setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...formData } : u));
        } else {
          throw new Error('Failed to update user');
        }
      }
      setUserModalOpen(false);
    } catch (err: any) {
      console.error(err);
      setFormError(err.message || 'An error occurred while saving.');
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        const res = await fetch(`/api/mock/admin/users?id=${id}`, { method: 'DELETE' });
        if (res.ok) {
          setUsers(users.filter(u => u.id !== id));
        } else {
          alert("Failed to delete user.");
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const toggleUserStatus = async (user: any) => {
    const newStatus = user.status === 'restricted' ? 'active' : 'restricted';
    const action = newStatus === 'restricted' ? 'restrict' : 'unrestrict';
    if (confirm(`Are you sure you want to ${action} ${user.name}?`)) {
      try {
        await AdminService.updateUserStatus(user.id, newStatus);
        setUsers(users.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
      } catch (err) {
        console.error("Failed to update status", err);
        alert(`Failed to ${action} user.`);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <span className="material-symbols-outlined text-4xl animate-spin text-primary">sync</span>
      </div>
    );
  }

  const filteredUsers = users.filter((u) => {
    if (session?.user?.email && u.email === session.user.email) return false;
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || u.role.toLowerCase() === filterRole;
    return matchesSearch && matchesRole;
  });

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);
  
  const paginatedUsers = filteredUsers.slice(
    (safeCurrentPage - 1) * usersPerPage, 
    safeCurrentPage * usersPerPage
  );

  return (
    <div className="max-w-container-max mx-auto space-y-lg pb-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-headline-xl text-headline-xl text-primary tracking-tight">User Management</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Manage users, roles, and API limits across the platform.</p>
        </div>
        <button 
          className="bg-primary text-on-primary px-4 py-2 rounded-[8px] flex items-center gap-2 hover:bg-surface-tint transition-colors text-sm font-bold shadow-sm cursor-pointer"
          onClick={openAddModal}
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add User
        </button>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 sm:p-6 border-b border-outline-variant flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full sm:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-transparent focus:border-primary focus:ring-1 focus:ring-primary rounded-[8px] font-body-sm outline-none transition-all"
            />
          </div>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-on-surface pointer-events-none">filter_list</span>
            <select 
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="pl-9 pr-8 py-2 border border-outline-variant text-on-surface rounded-[8px] font-label-md text-label-md hover:bg-surface-container-high transition-colors appearance-none cursor-pointer outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-transparent"
            >
              <option value="all">All Roles</option>
              <option value="user">User</option>
              {/* <option value="admin">Admin</option>
              <option value="superadmin">Superadmin</option> */}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant pointer-events-none">expand_more</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold border-b border-outline-variant">User</th>
                <th className="px-6 py-4 font-semibold border-b border-outline-variant">Role</th>
                <th className="px-6 py-4 font-semibold border-b border-outline-variant">Status</th>
                <th className="px-6 py-4 font-semibold border-b border-outline-variant">Usage / Limit</th>
                <th className="px-6 py-4 font-semibold border-b border-outline-variant text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="font-body-sm text-body-sm text-primary divide-y divide-outline-variant/50">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-on-surface-variant">
                    No users found matching your criteria.
                  </td>
                </tr>
              ) : paginatedUsers.map((u) => {
                const usagePercentage = (u.tokensUsed / u.apiLimit) * 100;
                const isOverLimit = usagePercentage >= 100;

                return (
                  <tr key={u.id} className="hover:bg-surface-container-low/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-surface-container-highest flex-shrink-0 flex items-center justify-center text-primary font-bold overflow-hidden">
                          {u.avatar ? <img src={u.avatar} alt="Profile" className="w-full h-full object-cover" /> : u.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-on-background">{u.name}</p>
                          <p className="text-on-surface-variant text-[12px]">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-secondary-container text-on-secondary-container rounded-DEFAULT text-[11px] font-semibold tracking-wide capitalize">
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${u.status === 'active' ? 'bg-[#4CAF50]' : u.status === 'restricted' ? 'bg-error' : 'bg-outline'}`}></div>
                        <span className={`capitalize ${u.status === 'restricted' ? 'text-error font-bold' : 'text-on-surface'}`}>{u.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 w-full max-w-[200px]">
                        <div className="flex justify-between items-end">
                          <span className="font-code-sm text-xs text-on-surface-variant">
                            {u.tokensUsed.toLocaleString()} / <span className="font-medium text-primary">{u.apiLimit.toLocaleString()}</span>
                          </span>
                        </div>
                        <div className="w-full bg-surface-variant rounded-full h-1.5">
                          <div 
                            className={`h-1.5 rounded-full ${isOverLimit ? 'bg-error' : usagePercentage > 80 ? 'bg-[#F57F17]' : 'bg-primary'}`} 
                            style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 transition-opacity">
                        <button 
                          onClick={() => toggleUserStatus(u)}
                          className={`${u.status === 'restricted' ? 'text-secondary hover:bg-secondary/10' : 'text-error hover:bg-error-container'} p-1.5 rounded-full transition-colors cursor-pointer`}
                          title={u.status === 'restricted' ? "Unrestrict User" : "Restrict User"}
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {u.status === 'restricted' ? 'lock_open' : 'block'}
                          </span>
                        </button>
                        <button 
                          onClick={() => openEditModal(u)}
                          className="text-on-surface-variant hover:text-primary p-1.5 rounded-full hover:bg-surface-container-high transition-colors cursor-pointer"
                          title="Edit User"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(u.id)}
                          className="text-error hover:bg-error-container p-1.5 rounded-full transition-colors cursor-pointer" title="Delete User"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-outline-variant flex items-center justify-between bg-surface-container-lowest">
          <span className="font-body-sm text-on-surface-variant">
            Showing {((safeCurrentPage - 1) * usersPerPage) + (paginatedUsers.length > 0 ? 1 : 0)} to {((safeCurrentPage - 1) * usersPerPage) + paginatedUsers.length} of {filteredUsers.length} entries
          </span>
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="p-2 border border-outline-variant rounded hover:bg-surface-container-high text-on-surface-variant transition-colors disabled:opacity-50 cursor-pointer" 
              disabled={safeCurrentPage === 1}
            >
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <button className="px-3 py-1 bg-primary text-on-primary rounded font-label-md cursor-pointer">{safeCurrentPage}</button>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="p-2 border border-outline-variant rounded hover:bg-surface-container-high text-on-surface-variant transition-colors disabled:opacity-50 cursor-pointer" 
              disabled={safeCurrentPage === totalPages}
            >
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Add / Edit User Modal */}
      {userModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="font-headline-lg text-primary mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined">{modalMode === 'create' ? 'person_add' : 'manage_accounts'}</span>
              {modalMode === 'create' ? 'Add New User' : 'Edit User'}
            </h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 bg-surface-container-low border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-[8px] font-body-sm outline-none transition-all"
                  placeholder="e.g. John Doe"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Email</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2 bg-surface-container-low border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-[8px] font-body-sm outline-none transition-all"
                  placeholder="e.g. john@example.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Role</label>
                  <select 
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full px-4 py-2 bg-surface-container-low border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-[8px] font-body-sm outline-none transition-all"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Status</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-4 py-2 bg-surface-container-low border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-[8px] font-body-sm outline-none transition-all"
                  >
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">API Token Limit</label>
                <input 
                  type="number" 
                  value={formData.apiLimit}
                  onChange={(e) => setFormData({...formData, apiLimit: parseInt(e.target.value) || 0})}
                  className="w-full px-4 py-2 bg-surface-container-low border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-[8px] font-body-sm outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setUserModalOpen(false)}
                className="px-4 py-2 border border-outline-variant text-on-surface rounded-[8px] font-label-md text-label-md hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveUser}
                className="px-6 py-2 bg-primary text-on-primary rounded-[8px] font-label-md text-label-md hover:bg-surface-tint transition-colors cursor-pointer flex items-center gap-2"
                disabled={!formData.name || !formData.email}
              >
                <span className="material-symbols-outlined text-[18px]">save</span>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
