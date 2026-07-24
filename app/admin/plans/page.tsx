"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function SubscriptionPlansPage() {
  const [currentPlan, setCurrentPlan] = useState('Pro');
  
  // Modal State
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  
  // Form State
  const [formData, setFormData] = useState({ name: '', price: 0, tokens: 0, description: '' });

  const openAddModal = () => {
    setModalMode('create');
    setFormData({ name: '', price: 0, tokens: 100000, description: '' });
    setPlanModalOpen(true);
  };

  const openEditModal = (planName: string, price: number, tokens: number, desc: string) => {
    setModalMode('edit');
    setFormData({ name: planName, price: price, tokens: tokens, description: desc });
    setPlanModalOpen(true);
  };

  return (
    <div className="max-w-container-max mx-auto pb-8">
      {/* Settings Header Area */}
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h2 className="font-headline-xl text-headline-xl font-bold text-primary mb-2 tracking-tight">Subscription Plans</h2>
          <p className="text-on-surface-variant font-body-lg text-body-lg">Manage your current plan, view billing history, and configure available tiers.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="px-6 py-3 bg-primary text-on-primary rounded-[8px] font-label-md text-label-md hover:bg-surface-tint transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">add</span> Create New Plan
        </button>
      </div>

      {/* Current Plan Banner */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between mb-12 shadow-sm">
        <div className="flex items-start md:items-center gap-4 mb-4 md:mb-0">
          <div className="h-12 w-12 rounded-full bg-surface-variant flex items-center justify-center border border-outline-variant flex-shrink-0">
            <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
          </div>
          <div>
            <h3 className="font-headline-lg text-headline-lg font-bold text-primary">Current Plan: {currentPlan}</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {currentPlan === 'Free' ? 'No billing active.' : currentPlan === 'Pro' ? 'Billed $49/month. Next billing date: Oct 15, 2026' : 'Custom Enterprise Billing.'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {currentPlan !== 'Free' && (
            <>
              <button onClick={() => setCurrentPlan('Free')} className="px-4 py-2 border border-outline-variant text-primary rounded-[8px] font-medium hover:bg-surface-variant transition-colors text-sm cursor-pointer">Cancel Plan</button>
              <Link href="/admin/plans/payment" className="px-4 py-2 bg-primary text-on-primary rounded-[8px] font-medium hover:bg-primary-container transition-colors text-sm cursor-pointer inline-block">Update Payment Method</Link>
            </>
          )}
        </div>
      </div>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        
        {/* Free Plan */}
        <div className={`bg-surface-container-lowest border ${currentPlan === 'Free' ? 'border-2 border-primary shadow-md relative transform scale-100 md:scale-105 z-10' : 'border-outline-variant shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md duration-300'} rounded-xl p-8 flex flex-col`}>
          {currentPlan === 'Free' && <div className="absolute top-0 right-0 bg-primary text-on-primary text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">ACTIVE</div>}
          <div className="mb-6 mt-2">
            <div className="flex justify-between items-start">
              <h4 className="font-headline-lg text-headline-lg font-semibold text-primary mb-1">Free</h4>
              <button onClick={() => openEditModal('Free', 0, 100000, 'For individuals exploring AI capabilities.')} className="text-secondary hover:text-primary transition-colors cursor-pointer"><span className="material-symbols-outlined text-sm">edit</span></button>
            </div>
            <p className="text-sm text-on-surface-variant mb-4">For individuals exploring AI capabilities.</p>
            <div className="flex items-baseline">
              <span className="text-4xl font-bold text-primary">$0</span>
              <span className="text-on-surface-variant ml-1 font-body-sm">/month</span>
            </div>
          </div>
          {currentPlan === 'Free' ? (
            <button className="w-full py-2.5 bg-surface-container-high text-on-surface-variant border border-outline-variant rounded-[8px] font-medium mb-8 cursor-default" disabled>Manage Plan</button>
          ) : (
            <button onClick={() => setCurrentPlan('Free')} className="w-full py-2.5 border border-outline-variant text-primary rounded-[8px] font-medium hover:bg-surface-variant transition-colors mb-8 cursor-pointer">Downgrade to Free</button>
          )}
          
          <div className="flex-1">
            <p className="text-sm font-semibold text-primary mb-4 uppercase tracking-wider">Features</p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-secondary text-sm mt-0.5">check</span>
                <span className="text-sm text-primary">100k Tokens / month</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-secondary text-sm mt-0.5">check</span>
                <span className="text-sm text-primary">Basic GPT-3.5 Access</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-secondary text-sm mt-0.5">check</span>
                <span className="text-sm text-primary">Community Support</span>
              </li>
              <li className="flex items-start gap-3 opacity-50">
                <span className="material-symbols-outlined text-secondary text-sm mt-0.5">close</span>
                <span className="text-sm text-primary">Priority Processing</span>
              </li>
              <li className="flex items-start gap-3 opacity-50">
                <span className="material-symbols-outlined text-secondary text-sm mt-0.5">close</span>
                <span className="text-sm text-primary">Custom Fine-tuning</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Pro Plan */}
        <div className={`bg-surface-container-lowest border ${currentPlan === 'Pro' ? 'border-2 border-primary shadow-md relative transform scale-100 md:scale-105 z-10' : 'border-outline-variant shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md duration-300'} rounded-xl p-8 flex flex-col`}>
          {currentPlan === 'Pro' && <div className="absolute top-0 right-0 bg-primary text-on-primary text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">ACTIVE</div>}
          <div className="mb-6 mt-2">
            <div className="flex justify-between items-start">
              <h4 className="font-headline-lg text-headline-lg font-semibold text-primary mb-1">Pro</h4>
              <button onClick={() => openEditModal('Pro', 49, 5000000, 'For professionals building AI applications.')} className="text-secondary hover:text-primary transition-colors cursor-pointer"><span className="material-symbols-outlined text-sm">edit</span></button>
            </div>
            <p className="text-sm text-on-surface-variant mb-4">For professionals building AI applications.</p>
            <div className="flex items-baseline">
              <span className="text-4xl font-bold text-primary">$49</span>
              <span className="text-on-surface-variant ml-1 font-body-sm">/month</span>
            </div>
          </div>
          {currentPlan === 'Pro' ? (
            <button className="w-full py-2.5 bg-surface-container-high text-on-surface-variant border border-outline-variant rounded-[8px] font-medium mb-8 cursor-default" disabled>Manage Plan</button>
          ) : (
            <button onClick={() => setCurrentPlan('Pro')} className="w-full py-2.5 border border-outline-variant text-primary rounded-[8px] font-medium hover:bg-surface-variant transition-colors mb-8 cursor-pointer">Upgrade to Pro</button>
          )}
          
          <div className="flex-1">
            <p className="text-sm font-semibold text-primary mb-4 uppercase tracking-wider">Features</p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-sm mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <span className="text-sm text-primary font-medium">5M Tokens / month</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-sm mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <span className="text-sm text-primary font-medium">GPT-4 Access</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-sm mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <span className="text-sm text-primary font-medium">Standard Email Support</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-sm mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <span className="text-sm text-primary font-medium">Priority Processing</span>
              </li>
              <li className="flex items-start gap-3 opacity-50">
                <span className="material-symbols-outlined text-secondary text-sm mt-0.5">close</span>
                <span className="text-sm text-primary">Custom Fine-tuning</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Enterprise Plan */}
        <div className={`bg-surface-container-lowest border ${currentPlan === 'Enterprise' ? 'border-2 border-primary shadow-md relative transform scale-100 md:scale-105 z-10' : 'border-outline-variant shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md duration-300'} rounded-xl p-8 flex flex-col`}>
          {currentPlan === 'Enterprise' && <div className="absolute top-0 right-0 bg-primary text-on-primary text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">ACTIVE</div>}
          <div className="mb-6 mt-2">
            <div className="flex justify-between items-start">
              <h4 className="font-headline-lg text-headline-lg font-semibold text-primary mb-1">Enterprise</h4>
              <button onClick={() => openEditModal('Enterprise', 999, 1000000000, 'For large teams with advanced security needs.')} className="text-secondary hover:text-primary transition-colors cursor-pointer"><span className="material-symbols-outlined text-sm">edit</span></button>
            </div>
            <p className="text-sm text-on-surface-variant mb-4">For large teams with advanced security needs.</p>
            <div className="flex items-baseline">
              <span className="text-4xl font-bold text-primary">Custom</span>
            </div>
          </div>
          {currentPlan === 'Enterprise' ? (
            <button className="w-full py-2.5 bg-surface-container-high text-on-surface-variant border border-outline-variant rounded-[8px] font-medium mb-8 cursor-default" disabled>Manage Plan</button>
          ) : (
            <button onClick={() => setCurrentPlan('Enterprise')} className="w-full py-2.5 bg-primary text-on-primary rounded-[8px] font-medium hover:bg-primary-container transition-colors mb-8 cursor-pointer">Upgrade to Enterprise</button>
          )}
          
          <div className="flex-1">
            <p className="text-sm font-semibold text-primary mb-4 uppercase tracking-wider">Features</p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-secondary text-sm mt-0.5">check</span>
                <span className="text-sm text-primary">Unlimited Tokens</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-secondary text-sm mt-0.5">check</span>
                <span className="text-sm text-primary">All Models Access</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-secondary text-sm mt-0.5">check</span>
                <span className="text-sm text-primary">24/7 Phone Support</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-secondary text-sm mt-0.5">check</span>
                <span className="text-sm text-primary">Highest Priority Processing</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-secondary text-sm mt-0.5">check</span>
                <span className="text-sm text-primary">Custom Fine-tuning & SLA</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Add / Edit Plan Modal */}
      {planModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="font-headline-lg text-primary mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined">{modalMode === 'create' ? 'add_circle' : 'edit_document'}</span>
              {modalMode === 'create' ? 'Create New Plan' : 'Edit Plan'}
            </h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Plan Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 bg-surface-container-low border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-[8px] font-body-sm outline-none transition-all"
                  placeholder="e.g. Starter"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Monthly Price ($)</label>
                  <input 
                    type="number" 
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-2 bg-surface-container-low border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-[8px] font-body-sm outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Token Limit</label>
                  <input 
                    type="number" 
                    value={formData.tokens}
                    onChange={(e) => setFormData({...formData, tokens: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-2 bg-surface-container-low border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-[8px] font-body-sm outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Description</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2 bg-surface-container-low border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-[8px] font-body-sm outline-none transition-all resize-none h-20"
                  placeholder="Short description for the pricing card"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setPlanModalOpen(false)}
                className="px-4 py-2 border border-outline-variant text-on-surface rounded-[8px] font-label-md text-label-md hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={() => setPlanModalOpen(false)}
                className="px-6 py-2 bg-primary text-on-primary rounded-[8px] font-label-md text-label-md hover:bg-surface-tint transition-colors cursor-pointer flex items-center gap-2"
                disabled={!formData.name}
              >
                <span className="material-symbols-outlined text-[18px]">save</span>
                Save Plan
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
