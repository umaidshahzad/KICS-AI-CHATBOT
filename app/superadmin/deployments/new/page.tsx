"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function NewDeploymentPage() {
  const [deploymentName, setDeploymentName] = useState('');
  const [region, setRegion] = useState('US-East');
  const [nodes, setNodes] = useState(2);
  const [status, setStatus] = useState<string | null>(null);

  const handleDeploy = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Initializing deployment sequence...');
    setTimeout(() => {
      setStatus('Provisioning active nodes...');
      setTimeout(() => {
        setStatus('Deployment successful!');
      }, 1500);
    }, 1500);
  };

  return (
    <div className="max-w-[1000px] mx-auto w-full flex-1 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <Link href="/superadmin" className="text-primary hover:underline font-label-md flex items-center gap-1 mb-2">
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Back to Overview
        </Link>
        <h2 className="font-headline-xl text-3xl md:text-4xl font-bold text-primary tracking-tight">New Deployment</h2>
        <p className="font-body-lg text-lg text-on-surface-variant max-w-2xl">Provision new infrastructure, allocate API nodes, and expand your global footprint.</p>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden p-8">
        <form onSubmit={handleDeploy} className="space-y-8">
          
          <div className="space-y-6">
            <h3 className="font-headline-md text-xl font-bold text-on-surface mb-4 border-b border-outline-variant pb-2">Deployment Configuration</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-label-sm font-bold text-on-surface-variant uppercase tracking-wider mb-2">Deployment Name</label>
                <input 
                  type="text" 
                  required
                  value={deploymentName}
                  onChange={(e) => setDeploymentName(e.target.value)}
                  placeholder="e.g. EU-West Expansion" 
                  className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-3 text-on-surface focus:outline-none focus:border-primary transition-colors" 
                />
              </div>
              <div>
                <label className="block font-label-sm font-bold text-on-surface-variant uppercase tracking-wider mb-2">Target Region</label>
                <select 
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-3 text-on-surface focus:outline-none focus:border-primary transition-colors"
                >
                  <option value="US-East">North America (US-East)</option>
                  <option value="US-West">North America (US-West)</option>
                  <option value="EU-Central">Europe (EU-Central)</option>
                  <option value="EU-West">Europe (EU-West)</option>
                  <option value="AP-East">Asia Pacific (AP-East)</option>
                  <option value="AP-South">Asia Pacific (AP-South)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-label-sm font-bold text-on-surface-variant uppercase tracking-wider mb-2 flex justify-between">
                <span>Allocate Active Nodes</span>
                <span className="text-primary">{nodes} Nodes</span>
              </label>
              <input 
                type="range" 
                min="1" 
                max="32" 
                value={nodes}
                onChange={(e) => setNodes(Number(e.target.value))}
                className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary outline-none" 
              />
              <div className="flex justify-between text-[10px] text-on-surface-variant mt-2 font-label-sm uppercase font-bold">
                <span>1 Node (Dev)</span>
                <span>32 Nodes (Enterprise)</span>
              </div>
            </div>
            
            <div className="p-4 bg-primary-container/20 border border-primary/30 rounded-xl flex items-start gap-3">
              <span className="material-symbols-outlined text-primary">cloud_done</span>
              <div>
                <p className="font-label-md font-bold text-on-surface">Auto-Scaling Enabled</p>
                <p className="font-body-sm text-on-surface-variant mt-1">This deployment will automatically scale up to 2x its allocated nodes during high traffic periods.</p>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-6 border-t border-outline-variant flex items-center justify-end gap-4">
            {status && (
              <span className={`font-label-sm font-bold ${status.includes('successful') ? 'text-green-600' : 'text-primary animate-pulse'}`}>
                {status}
              </span>
            )}
            <Link 
              href="/superadmin"
              className="px-6 py-2.5 font-label-md font-bold text-on-surface-variant hover:bg-surface-container rounded-xl transition-colors"
            >
              Cancel
            </Link>
            <button 
              type="submit" 
              disabled={status !== null && !status.includes('successful')}
              className="px-6 py-2.5 bg-primary text-on-primary font-label-md font-bold rounded-xl hover:bg-primary/90 shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
              Launch Deployment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
