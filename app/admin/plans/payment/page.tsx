"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function UpdatePaymentMethodPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="max-w-container-max mx-auto pb-8">
      {/* Header Area */}
      <div className="mb-10 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 text-on-surface-variant font-body-sm mb-2">
            <Link href="/admin/plans" className="hover:text-primary transition-colors cursor-pointer">Subscription Plans</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-on-surface">Payment Method</span>
          </div>
          <h2 className="font-headline-xl text-headline-xl font-bold text-primary mb-2 tracking-tight">Update Payment Method</h2>
          <p className="text-on-surface-variant font-body-lg text-body-lg">Manage your credit card and billing details.</p>
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm max-w-2xl">
        <div className="p-6 md:p-8">
          <form onSubmit={handleSave} className="space-y-6">
            
            {/* Current Method Info */}
            <div className="bg-surface-container-low border border-outline-variant rounded-lg p-4 flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-surface-container-highest border border-outline-variant rounded flex flex-shrink-0 items-center justify-center">
                  <span className="font-bold text-xs text-on-surface-variant">VISA</span>
                </div>
                <div>
                  <p className="font-bold text-on-surface text-sm">Visa ending in 4242</p>
                  <p className="text-on-surface-variant text-xs">Expires 12/28</p>
                </div>
              </div>
              <span className="px-2 py-1 bg-primary/10 text-primary rounded text-[11px] font-bold uppercase tracking-wider">Default</span>
            </div>

            <h3 className="font-headline-md text-primary mb-4">New Card Details</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Cardholder Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-[8px] font-body-sm outline-none transition-all"
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Card Number</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">credit_card</span>
                  <input 
                    type="text" 
                    required
                    className="w-full pl-12 pr-4 py-3 bg-surface-container-low border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-[8px] font-body-sm outline-none transition-all"
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Expiry Date</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-[8px] font-body-sm outline-none transition-all"
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">CVC / CVV</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-[8px] font-body-sm outline-none transition-all"
                    placeholder="123"
                    maxLength={4}
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-outline-variant flex flex-col-reverse sm:flex-row justify-end gap-3">
              <Link 
                href="/admin/plans"
                className="px-6 py-2.5 border border-outline-variant text-on-surface text-center rounded-[8px] font-label-md text-label-md hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                Cancel
              </Link>
              <button 
                type="submit"
                disabled={isSaving || saveSuccess}
                className="px-6 py-2.5 bg-primary text-on-primary rounded-[8px] font-label-md text-label-md hover:bg-surface-tint transition-colors cursor-pointer flex items-center justify-center gap-2 min-w-[140px]"
              >
                {isSaving ? (
                  <><span className="material-symbols-outlined text-[18px] animate-spin">sync</span> Saving...</>
                ) : saveSuccess ? (
                  <><span className="material-symbols-outlined text-[18px]">check</span> Saved Successfully</>
                ) : (
                  <><span className="material-symbols-outlined text-[18px]">credit_score</span> Save Payment Method</>
                )}
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
}
