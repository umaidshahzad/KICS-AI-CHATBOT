"use client";

import { useEffect, useState } from 'react';
import { AdminService } from '../../../services/admin.service';

export default function AccessRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  // Filtering & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  
  // Modal states
  const [viewModalData, setViewModalData] = useState<any | null>(null);
  const [approveModalData, setApproveModalData] = useState<any | null>(null);
  const [approveEmail, setApproveEmail] = useState('');
  const [approvePassword, setApprovePassword] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await AdminService.getAccessRequests();
        setRequests(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleApprove = async (req: any, finalEmail: string, generatedPassword?: string) => {
    setActionLoading(req.id);
    setApproveModalData(null); // close modal
    try {
      await AdminService.approveRequest(req.id, req.name, finalEmail);
      setRequests(requests.map(r => r.id === req.id ? { ...r, status: 'APPROVED', generatedEmail: finalEmail, generatedPassword } : r));
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    setActionLoading(id);
    try {
      await AdminService.rejectRequest(id);
      setRequests(requests.map(r => r.id === id ? { ...r, status: 'REJECTED' } : r));
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <span className="material-symbols-outlined text-4xl animate-spin text-primary">sync</span>
      </div>
    );
  }

  const filteredRequests = requests.filter(r => {
    const matchesSearch = (r.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (r.email || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'ALL' || r.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-container-max mx-auto space-y-lg pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-headline-xl text-headline-xl text-primary tracking-tight">Access Requests</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Review and manage pending user access applications.</p>
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 sm:p-6 border-b border-outline-variant flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full sm:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search requests..." 
              className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-transparent focus:border-primary focus:ring-1 focus:ring-primary rounded-[8px] font-body-sm outline-none transition-all"
            />
          </div>
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-outline-variant bg-surface-container-lowest text-on-surface rounded-[8px] font-label-md text-label-md outline-none focus:border-primary cursor-pointer hover:bg-surface-container-high transition-colors"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold border-b border-outline-variant">User</th>
                <th className="px-6 py-4 font-semibold border-b border-outline-variant">Auth Type</th>
                <th className="px-6 py-4 font-semibold border-b border-outline-variant">Reason</th>
                <th className="px-6 py-4 font-semibold border-b border-outline-variant">Status</th>
                <th className="px-6 py-4 font-semibold border-b border-outline-variant text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="font-body-sm text-body-sm text-primary divide-y divide-outline-variant/50">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-on-surface-variant">
                    No access requests found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((r) => (
                  <tr key={r.id} className="hover:bg-surface-container-low/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-surface-container-highest flex-shrink-0 flex items-center justify-center text-primary font-bold">
                          {r.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-on-background">{r.name}</p>
                          <p className="text-on-surface-variant text-[12px]">{r.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-surface-container-high text-on-surface rounded-[4px] text-[11px] font-semibold tracking-wide uppercase">
                        {r.authType}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate text-on-surface-variant" title={r.reason}>
                      {r.reason || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[11px] font-semibold capitalize flex items-center gap-1 w-max ${
                        r.status === 'PENDING' ? 'bg-[#FFF9C4] text-[#F57F17] border border-[#FFF59D]' :
                        r.status === 'APPROVED' ? 'bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]' :
                        'bg-error-container text-on-error-container border border-[#ffb4ab]'
                      }`}>
                        {r.status === 'PENDING' && <span className="material-symbols-outlined text-[12px]">schedule</span>}
                        {r.status === 'APPROVED' && <span className="material-symbols-outlined text-[12px]">check_circle</span>}
                        {r.status === 'REJECTED' && <span className="material-symbols-outlined text-[12px]">cancel</span>}
                        {r.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 transition-opacity">
                        {r.status === 'PENDING' && (
                          <>
                            <button 
                              onClick={() => {
                                if (r.authType === 'Manual' || r.authType === 'MANUAL') {
                                  setApproveEmail(r.email);
                                  setApprovePassword('');
                                  setApproveModalData(r);
                                } else {
                                  handleApprove(r, r.email);
                                }
                              }}
                              className="text-primary hover:bg-primary-container p-1.5 rounded-full transition-colors cursor-pointer" title="Approve Request"
                              disabled={actionLoading === r.id}
                            >
                              <span className="material-symbols-outlined text-[18px]">check_circle</span>
                            </button>
                            <button 
                              onClick={() => handleReject(r.id)}
                              className="text-error hover:bg-error-container p-1.5 rounded-full transition-colors cursor-pointer" title="Reject Request"
                              disabled={actionLoading === r.id}
                            >
                              <span className="material-symbols-outlined text-[18px]">cancel</span>
                            </button>
                          </>
                        )}
                        <button 
                          onClick={() => setViewModalData(r)}
                          className="text-on-surface-variant hover:bg-surface-container-high p-1.5 rounded-full transition-colors cursor-pointer" title="View Details"
                        >
                          <span className="material-symbols-outlined text-[18px]">visibility</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Details Modal */}
      {viewModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="font-headline-lg text-primary mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined">info</span>
              {viewModalData.status === 'APPROVED' && viewModalData.generatedPassword ? 'Generated Credentials' : 'Request Details'}
            </h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Name</p>
                <p className="text-on-surface font-medium">{viewModalData.name}</p>
              </div>
              
              <div>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Email</p>
                <p className="text-on-surface font-medium">{viewModalData.status === 'APPROVED' && viewModalData.generatedEmail ? viewModalData.generatedEmail : viewModalData.email}</p>
              </div>

              {viewModalData.status === 'APPROVED' && viewModalData.generatedPassword ? (
                <div>
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Generated Password</p>
                  <div className="flex items-center justify-between bg-surface-container-high p-3 rounded-lg border border-outline-variant">
                    <code className="text-primary font-bold">{viewModalData.generatedPassword}</code>
                    <button onClick={() => navigator.clipboard.writeText(viewModalData.generatedPassword)} className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer" title="Copy Password">
                      <span className="material-symbols-outlined text-[18px]">content_copy</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Reason for Access</p>
                  <p className="text-on-surface-variant bg-surface-container-low p-3 rounded-lg border border-outline-variant text-sm">
                    {viewModalData.reason || 'No reason provided.'}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button 
                onClick={() => setViewModalData(null)}
                className="px-6 py-2 bg-primary text-on-primary rounded-[8px] font-label-md text-label-md hover:bg-surface-tint transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approve Request Modal */}
      {approveModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="font-headline-lg text-primary mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined">vpn_key</span>
              Generate Credentials
            </h3>
            <p className="text-sm text-on-surface-variant mb-6">Confirm the details and generate a temporary password for {approveModalData.name}.</p>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Confirm Email</label>
                <input 
                  type="email" 
                  value={approveEmail}
                  onChange={(e) => setApproveEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-surface-container-low border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-[8px] font-body-sm outline-none transition-all"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Custom Password (Optional)</label>
                <input 
                  type="text" 
                  placeholder="Leave blank to auto-generate"
                  value={approvePassword}
                  onChange={(e) => setApprovePassword(e.target.value)}
                  className="w-full px-4 py-2 bg-surface-container-low border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-[8px] font-body-sm outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setApproveModalData(null)}
                className="px-4 py-2 border border-outline-variant text-on-surface rounded-[8px] font-label-md text-label-md hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  const finalPass = approvePassword.trim() || Math.random().toString(36).slice(-8) + "!";
                  handleApprove(approveModalData, approveEmail, finalPass);
                }}
                className="px-6 py-2 bg-primary text-on-primary rounded-[8px] font-label-md text-label-md hover:bg-surface-tint transition-colors cursor-pointer flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                Approve & Generate
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
