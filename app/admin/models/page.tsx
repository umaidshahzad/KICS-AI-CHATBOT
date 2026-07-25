"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function ModelsManagementPage() {
  const [models, setModels] = useState([
    {
      id: 'm1',
      name: 'GPT-4 Turbo',
      provider: 'OpenAI',
      version: 'v0125',
      icon: 'smart_toy',
      status: 'Active',
      requests: '1,245',
      latency: '840ms',
    },
    {
      id: 'm2',
      name: 'Claude 3 Opus',
      provider: 'Anthropic',
      version: '20240229',
      icon: 'psychology',
      status: 'Active',
      requests: '892',
      latency: '1.2s',
    },
    {
      id: 'm3',
      name: 'Llama 3 70B',
      provider: 'Meta',
      version: 'Self-Hosted',
      icon: 'memory',
      status: 'Disabled',
      error: 'Model offline',
      details: 'This model has been disabled by the Super Admin.',
    }
  ]);
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [modalContent, setModalContent] = useState<{title: string, message: string} | null>(null);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setModalContent({ title: 'Status Refreshed', message: 'All model endpoints are synced with the latest health data.' });
    }, 1000);
  };

  const handleRestartNode = (id: string) => {
    setModalContent({ title: 'Restarting Node', message: 'The cluster node is currently restarting. This may take a few minutes.' });
    setModels(models.map(m => m.id === id ? { ...m, status: 'Active', error: undefined, details: undefined, requests: '0', latency: '0ms' } : m));
  };

  return (
    <div className="max-w-container-max mx-auto space-y-lg pb-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-section-gap">
        <div>
          <h2 className="font-headline-xl text-headline-xl text-primary tracking-tight">Model Configuration</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-2">Manage deployments, monitor status, and configure endpoint routing.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleRefresh}
            className="px-6 py-3 border border-outline-variant rounded-[8px] font-label-md text-label-md text-on-surface hover:bg-surface-container-low transition-colors flex items-center gap-2 cursor-pointer"
            disabled={isRefreshing}
          >
            <span className={`material-symbols-outlined ${isRefreshing ? 'animate-spin' : ''}`}>sync</span> {isRefreshing ? 'Refreshing...' : 'Refresh Status'}
          </button>
          <button 
            onClick={() => setModalContent({ title: 'Deploy Model', message: 'Model deployment interface is coming in v2.0.' })}
            className="px-6 py-3 bg-primary text-on-primary rounded-[8px] font-label-md hover:bg-surface-tint transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined">add</span> Deploy Model
          </button>
        </div>
      </div>

      {/* Bento Grid Layout for Models */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {models.map((model) => (
          <div key={model.id} className={`bg-surface-container-lowest rounded-xl p-6 shadow-sm flex flex-col relative overflow-hidden transition-shadow hover:shadow-md border ${model.status === 'Degraded' ? 'border-error-container' : model.status === 'Disabled' ? 'border-outline-variant opacity-70' : 'border-outline-variant/30'}`}>
            
            {model.status === 'Degraded' && (
              <div className="absolute top-0 left-0 w-1 h-full bg-error"></div>
            )}
            
            <div className={`flex justify-between items-start mb-4 ${(model.status === 'Degraded' || model.status === 'Disabled') ? 'pl-2' : ''}`}>
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-[8px] flex items-center justify-center ${model.status === 'Degraded' ? 'bg-error-container text-on-error-container' : model.status === 'Disabled' ? 'bg-surface-container text-on-surface-variant' : 'bg-surface-container-low text-primary'}`}>
                  <span className="material-symbols-outlined">{model.icon}</span>
                </div>
                <div>
                  <h3 className="font-headline-md text-headline-md text-on-background">{model.name}</h3>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">{model.provider} • {model.version}</p>
                </div>
              </div>
              
              {model.status === 'Active' ? (
                <span className="px-3 py-1 bg-[#E8F5E9] text-[#2E7D32] rounded-full font-label-sm text-label-sm flex items-center gap-1 border border-[#C8E6C9]">
                  <span className="w-2 h-2 rounded-full bg-[#4CAF50]"></span> Active
                </span>
              ) : model.status === 'Degraded' ? (
                <span className="px-3 py-1 bg-error-container text-on-error-container rounded-full font-label-sm text-label-sm flex items-center gap-1 border border-[#ffb4ab]">
                  <span className="material-symbols-outlined text-[14px]">error</span> Degraded
                </span>
              ) : (
                <span className="px-3 py-1 bg-surface-variant text-on-surface-variant rounded-full font-label-sm text-label-sm flex items-center gap-1 border border-outline-variant">
                  <span className="material-symbols-outlined text-[14px]">block</span> Disabled
                </span>
              )}
            </div>

            {model.status === 'Active' ? (
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-3 bg-surface-container-low rounded-[8px]">
                  <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Requests / min</p>
                  <p className="font-headline-md text-headline-md">{model.requests}</p>
                </div>
                <div className="p-3 bg-surface-container-low rounded-[8px]">
                  <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Avg Latency</p>
                  <p className="font-headline-md text-headline-md">{model.latency}</p>
                </div>
              </div>
            ) : model.status === 'Degraded' ? (
              <div className="p-4 bg-[#fff8f6] rounded-[8px] mb-6 border border-error-container pl-2 ml-2">
                <p className="font-label-sm text-label-sm text-error mb-1">{model.error}</p>
                <p className="font-body-md text-body-md text-on-surface-variant text-sm">{model.details}</p>
              </div>
            ) : (
              <div className="p-4 bg-surface-container-low rounded-[8px] mb-6 border border-outline-variant">
                <p className="font-label-sm text-label-sm text-on-surface mb-1">{model.error}</p>
                <p className="font-body-md text-body-md text-on-surface-variant text-sm">{model.details}</p>
              </div>
            )}

            <div className={`mt-auto flex gap-3 pt-4 border-t border-outline-variant/50 ${(model.status === 'Degraded' || model.status === 'Disabled') ? 'pl-2' : ''}`}>
              <Link 
                href={`/admin/models/${model.id}`}
                className={`flex-1 py-2 text-center rounded-[8px] font-label-sm text-label-sm transition-colors cursor-pointer ${
                  model.status === 'Disabled' 
                    ? 'border border-outline-variant text-on-surface opacity-50 pointer-events-none' 
                    : 'bg-primary text-on-primary hover:bg-primary/90 shadow-sm'
                }`}
              >
                View Analytics
              </Link>
              <button 
                disabled
                className="flex-1 py-2 text-center border border-outline-variant rounded-[8px] font-label-sm text-label-sm text-on-surface opacity-50 cursor-not-allowed"
              >
                API Settings
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Global Modals */}
      {modalContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg max-w-sm w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="font-headline-lg text-primary mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined">info</span>
              {modalContent.title}
            </h3>
            <p className="text-on-surface-variant font-body-md text-body-md mb-6">{modalContent.message}</p>
            <div className="flex justify-end">
              <button 
                onClick={() => setModalContent(null)}
                className="px-6 py-2 bg-primary text-on-primary rounded-[8px] font-label-md text-label-md hover:bg-surface-tint transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
