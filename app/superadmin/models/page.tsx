"use client";

import { useState } from 'react';

export default function SuperAdminModelsPage() {
  const [models, setModels] = useState([
    {
      id: 1,
      name: 'GPT-4 Turbo',
      status: 'Active Global',
      latency: 640,
      cost: 0.01,
      maxTokens: 4096,
      temperature: 0.7,
      endpoint: 'https://api.openai.com/v1/chat/completions',
      isActive: true,
      icon: 'psychology'
    },
    {
      id: 2,
      name: 'Claude 3.5 Sonnet',
      status: 'Active Routing',
      latency: 480,
      cost: 0.003,
      maxTokens: 8192,
      temperature: 0.5,
      endpoint: 'https://api.anthropic.com/v1/messages',
      isActive: true,
      icon: 'smart_toy'
    },
    {
      id: 3,
      name: 'Llama 3 70B',
      status: 'Fallback Mode',
      latency: 220,
      cost: 0.001,
      maxTokens: 4096,
      temperature: 0.6,
      endpoint: 'https://api.together.xyz/v1/chat/completions',
      isActive: false,
      icon: 'memory'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newModel, setNewModel] = useState({
    name: '',
    endpoint: '',
    maxTokens: 4096,
    temperature: 0.7,
    latency: 100,
    cost: 0.005,
    icon: 'memory'
  });

  const handleAddModel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModel.name || !newModel.endpoint) return;

    setModels([...models, {
      id: Date.now(),
      name: newModel.name,
      status: 'Fallback Mode',
      latency: newModel.latency,
      cost: newModel.cost,
      maxTokens: newModel.maxTokens,
      temperature: newModel.temperature,
      endpoint: newModel.endpoint,
      isActive: false,
      icon: newModel.icon
    }]);
    setShowAddModal(false);
    setNewModel({
      name: '',
      endpoint: '',
      maxTokens: 4096,
      temperature: 0.7,
      latency: 100,
      cost: 0.005,
      icon: 'memory'
    });
  };

  const toggleModel = (id: number) => {
    setModels(models.map(m => m.id === id ? { ...m, isActive: !m.isActive, status: !m.isActive ? 'Active Global' : 'Inactive' } : m));
  };

  const updateModel = (id: number, field: string, value: any) => {
    setModels(models.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  return (
    <div className="max-w-[1440px] mx-auto w-full flex-1 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-headline-xl text-3xl md:text-4xl font-bold text-primary mb-2">Model Configuration</h2>
          <p className="font-body-lg text-lg text-on-surface-variant max-w-2xl">Manage routing, token limits, and parameters for all active LLM endpoints in the global network.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-primary text-on-primary font-label-md py-3 px-6 rounded-xl hover:bg-primary/90 transition-all flex items-center gap-2 shadow-sm whitespace-nowrap font-bold"
        >
          <span className="material-symbols-outlined text-[20px]">add_circle</span>
          <span>Add New Model</span>
        </button>
      </div>

      {/* Bento Grid of Models */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {models.map(model => (
          <div key={model.id} className="bg-surface-container-lowest rounded-xl p-6 flex flex-col relative border border-outline-variant shadow-sm overflow-hidden group">
            {model.isActive && <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>}
            
            {/* Card Header */}
            <div className="flex justify-between items-start mb-6 pl-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-[28px]">{model.icon}</span>
                </div>
                <div>
                  <h3 className="font-headline-md text-xl font-bold text-primary leading-tight">{model.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`w-2 h-2 rounded-full ${model.isActive ? 'bg-green-500' : 'bg-surface-variant'}`}></span>
                    <span className="font-label-sm text-xs font-bold text-on-surface-variant">{model.status}</span>
                  </div>
                </div>
              </div>
              
              {/* Toggle */}
              <div className="relative inline-block w-12 align-middle select-none transition duration-200 ease-in">
                <input 
                  type="checkbox" 
                  checked={model.isActive} 
                  onChange={() => toggleModel(model.id)}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-surface-container-lowest appearance-none cursor-pointer z-10 transition-transform duration-200 checked:translate-x-full checked:border-primary outline-none" 
                />
                <label className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ${model.isActive ? 'bg-primary' : 'bg-outline-variant'}`}></label>
              </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-2 gap-4 mb-8 bg-surface-container-low rounded-xl p-4">
              <div>
                <p className="font-label-sm text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Avg Latency</p>
                <p className="font-body-lg text-lg font-bold text-primary">{model.latency} <span className="text-sm font-normal text-on-surface-variant">ms</span></p>
              </div>
              <div>
                <p className="font-label-sm text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Cost / 1k Tokens</p>
                <p className="font-body-lg text-lg font-bold text-primary">${model.cost} <span className="text-sm font-normal text-on-surface-variant">avg</span></p>
              </div>
            </div>

            {/* Config Inputs */}
            <div className="space-y-4 flex-1">
              <div>
                <label className="block font-label-sm text-xs font-bold text-on-surface-variant mb-1.5">Max Output Tokens</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={model.maxTokens} 
                    onChange={e => updateModel(model.id, 'maxTokens', Number(e.target.value))}
                    disabled={!model.isActive}
                    className="w-full bg-surface-container border border-outline-variant focus:border-primary rounded-lg px-4 py-2 font-body-md text-primary transition-all outline-none disabled:opacity-50" 
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 font-label-sm text-xs font-bold text-on-surface-variant">tokens</span>
                </div>
              </div>
              
              <div>
                <label className="block font-label-sm text-xs font-bold text-on-surface-variant mb-1.5 flex justify-between">
                  <span>Default Temperature</span>
                  <span className="text-primary font-bold">{model.temperature}</span>
                </label>
                <input 
                  type="range" 
                  min="0" max="1" step="0.1" 
                  value={model.temperature}
                  onChange={e => updateModel(model.id, 'temperature', Number(e.target.value))}
                  disabled={!model.isActive}
                  className="w-full h-1 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary disabled:opacity-50 outline-none" 
                />
                <div className="flex justify-between text-[10px] text-on-surface-variant mt-1 font-label-sm uppercase font-bold">
                  <span>Precise</span>
                  <span>Creative</span>
                </div>
              </div>
              
              <div>
                <label className="block font-label-sm text-xs font-bold text-on-surface-variant mb-1.5">API Key</label>
                <input 
                  type="password" 
                  value={model.endpoint}
                  onChange={e => updateModel(model.id, 'endpoint', e.target.value)}
                  disabled={!model.isActive}
                  placeholder="sk-..."
                  className="w-full bg-surface-container border border-outline-variant focus:border-primary rounded-lg px-4 py-2 font-body-md text-primary font-mono text-sm transition-all truncate outline-none disabled:opacity-50" 
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Model Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface">
              <h3 className="font-headline-md text-xl font-bold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined">memory_alt</span>
                Add New Model
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleAddModel} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block font-label-sm font-bold text-on-surface-variant uppercase tracking-wider mb-1">Model Name</label>
                <input 
                  type="text" 
                  required
                  value={newModel.name}
                  onChange={e => setNewModel({...newModel, name: e.target.value})}
                  className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2 text-on-surface focus:outline-none focus:border-primary"
                  placeholder="e.g. Gemini 1.5 Pro"
                />
              </div>
              
              <div>
                <label className="block font-label-sm font-bold text-on-surface-variant uppercase tracking-wider mb-1">API Key</label>
                <input 
                  type="password" 
                  required
                  value={newModel.endpoint}
                  onChange={e => setNewModel({...newModel, endpoint: e.target.value})}
                  className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2 text-on-surface focus:outline-none focus:border-primary font-mono text-sm"
                  placeholder="sk-..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-sm font-bold text-on-surface-variant uppercase tracking-wider mb-1">Max Tokens</label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    value={newModel.maxTokens}
                    onChange={e => setNewModel({...newModel, maxTokens: Number(e.target.value)})}
                    className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2 text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block font-label-sm font-bold text-on-surface-variant uppercase tracking-wider mb-1">Temperature</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    max="2"
                    step="0.1"
                    value={newModel.temperature}
                    onChange={e => setNewModel({...newModel, temperature: Number(e.target.value)})}
                    className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2 text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-sm font-bold text-on-surface-variant uppercase tracking-wider mb-1">Latency (ms)</label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    value={newModel.latency}
                    onChange={e => setNewModel({...newModel, latency: Number(e.target.value)})}
                    className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2 text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block font-label-sm font-bold text-on-surface-variant uppercase tracking-wider mb-1">Cost / 1k Tokens ($)</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    step="0.0001"
                    value={newModel.cost}
                    onChange={e => setNewModel({...newModel, cost: Number(e.target.value)})}
                    className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2 text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block font-label-sm font-bold text-on-surface-variant uppercase tracking-wider mb-1">Icon</label>
                <select 
                  value={newModel.icon}
                  onChange={e => setNewModel({...newModel, icon: e.target.value})}
                  className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2 text-on-surface focus:outline-none focus:border-primary"
                >
                  <option value="memory">Chip (Memory)</option>
                  <option value="psychology">Brain (Psychology)</option>
                  <option value="smart_toy">Robot (Smart Toy)</option>
                  <option value="bolt">Lightning (Bolt)</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3 justify-end border-t border-outline-variant mt-6">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)} 
                  className="px-5 py-2.5 text-on-surface-variant font-bold hover:bg-surface-container rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 bg-primary text-on-primary font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
                >
                  Save Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
