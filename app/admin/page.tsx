"use client";

import { useEffect, useState } from 'react';
import { AdminService } from '../../services/admin.service';

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [usersData, requestsData] = await Promise.all([
          AdminService.getUsers(),
          AdminService.getAccessRequests()
        ]);
        setUsers(usersData);
        setRequests(requestsData.filter((r: any) => r.status === 'PENDING'));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <span className="material-symbols-outlined text-4xl animate-spin text-primary">sync</span>
      </div>
    );
  }

  const totalTokens = users.reduce((acc, curr) => acc + (curr.tokensUsed || 0), 0);

  return (
    <div className="max-w-container-max mx-auto space-y-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg md:font-headline-xl md:text-headline-xl text-on-background">Admin Dashboard</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Manage platform access, token limits, and subscription statuses.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Users */}
        <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-DEFAULT hover:border-primary transition-colors flex flex-col justify-between h-32">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Total Users</span>
            <span className="material-symbols-outlined text-secondary">group</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-headline-xl text-headline-xl text-on-background">{users.length}</span>
            <span className="font-body-sm text-body-sm text-tertiary bg-tertiary-container/50 px-2 py-0.5 rounded-full flex items-center">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span> 4.2%
            </span>
          </div>
        </div>

        {/* Pending Requests */}
        <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-DEFAULT hover:border-primary transition-colors flex flex-col justify-between h-32">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Pending Requests</span>
            <span className="material-symbols-outlined text-tertiary">how_to_reg</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-headline-xl text-headline-xl text-on-background">{requests.length}</span>
            <span className="font-body-sm text-body-sm text-outline-variant">Awaiting Approval</span>
          </div>
        </div>

        {/* API Usage */}
        <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-DEFAULT hover:border-primary transition-colors flex flex-col justify-between h-32 relative overflow-hidden group">
          <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none flex items-end">
            <svg className="w-full h-1/2 text-primary" preserveAspectRatio="none" viewBox="0 0 100 30">
              <polyline fill="none" points="0,25 20,20 40,28 60,15 80,22 100,5" stroke="currentColor" strokeWidth="2"></polyline>
            </svg>
          </div>
          <div className="flex items-center justify-between relative z-10">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">API Usage (Tokens)</span>
            <span className="material-symbols-outlined text-primary">data_usage</span>
          </div>
          <div className="flex items-baseline gap-2 relative z-10">
            <span className="font-headline-xl text-headline-xl text-on-background">{totalTokens > 1000000 ? `${(totalTokens / 1000000).toFixed(1)}M` : `${(totalTokens / 1000).toFixed(1)}K`}</span>
            <span className="font-body-sm text-body-sm text-outline-variant">/ mo</span>
          </div>
        </div>
      </div>

      {/* Data Table Section */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-DEFAULT overflow-hidden flex flex-col">
        <div className="p-4 border-b border-outline-variant flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-bright">
          <div className="flex items-center gap-2">
            <span className="font-body-sm text-body-sm text-on-surface-variant">Recent Activity</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant bg-surface">
                <th className="p-4 font-label-caps text-label-caps text-on-surface-variant uppercase font-semibold">User</th>
                <th className="p-4 font-label-caps text-label-caps text-on-surface-variant uppercase font-semibold">Role</th>
                <th className="p-4 font-label-caps text-label-caps text-on-surface-variant uppercase font-semibold">Status</th>
                <th className="p-4 font-label-caps text-label-caps text-on-surface-variant uppercase font-semibold text-right">Tokens Used</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant font-body-sm text-body-sm">
              {users.slice(0, 3).map((u) => (
                <tr key={u.id} className="hover:bg-surface-container-low transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-surface-container-highest flex-shrink-0 flex items-center justify-center text-primary font-bold">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-on-background">{u.name}</p>
                        <p className="text-on-surface-variant text-[12px]">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-secondary-container text-on-secondary-container rounded-DEFAULT text-[11px] font-semibold tracking-wide capitalize">
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${u.status === 'active' ? 'bg-tertiary' : 'bg-outline'}`}></div>
                      <span className="text-on-surface capitalize">{u.status}</span>
                    </div>
                  </td>
                  <td className="p-4 text-right font-code-sm text-code-sm text-on-surface-variant">
                    {u.tokensUsed.toLocaleString()} / {u.apiLimit.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
