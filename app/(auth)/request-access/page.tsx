"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RequestAccessPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock API call to create access request
    try {
      await fetch('/api/mock/admin/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, reason, authType: 'Manual' })
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-surface text-on-surface font-body-md min-h-screen flex antialiased items-center justify-center p-4">
        <div className="w-full max-w-md bg-surface-container-lowest p-8 rounded-3xl shadow-xl border border-outline-variant/20 text-center">
          <div className="w-16 h-16 bg-primary-container rounded-2xl flex items-center justify-center text-on-primary-container mx-auto mb-6">
            <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          </div>
          <h2 className="text-2xl font-bold mb-4">Request Submitted</h2>
          <p className="text-on-surface-variant mb-8">
            Your request for credentials has been sent to the admin. You will receive an email once your request is approved.
          </p>
          <Link href="/login" className="bg-primary text-on-primary font-bold py-3 px-6 rounded-xl hover:bg-surface-tint transition-all inline-block">
            Return to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen flex antialiased items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface-container-lowest p-8 rounded-3xl shadow-xl border border-outline-variant/20">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => router.push('/login')} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h2 className="text-2xl font-bold">Request Access</h2>
        </div>

        <p className="text-on-surface-variant mb-6 text-sm">
          Submit your details to request access to the AI Studio. An administrator will review your request.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="font-label-sm text-on-surface-variant uppercase tracking-wider text-xs font-bold" htmlFor="name">Full Name</label>
            <input 
              id="name" 
              type="text" 
              required 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-surface-container border-none rounded-xl px-4 py-3 font-body-md text-on-surface focus:ring-2 focus:ring-primary/10 outline-none" 
              placeholder="John Doe" 
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-label-sm text-on-surface-variant uppercase tracking-wider text-xs font-bold" htmlFor="email">Work Email</label>
            <input 
              id="email" 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface-container border-none rounded-xl px-4 py-3 font-body-md text-on-surface focus:ring-2 focus:ring-primary/10 outline-none" 
              placeholder="john@company.com" 
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-label-sm text-on-surface-variant uppercase tracking-wider text-xs font-bold" htmlFor="reason">Reason for Access</label>
            <textarea 
              id="reason" 
              required 
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-surface-container border-none rounded-xl px-4 py-3 font-body-md text-on-surface focus:ring-2 focus:ring-primary/10 outline-none resize-none h-24" 
              placeholder="I need access to the marketing AI tools..." 
            />
          </div>

          <button disabled={isLoading} type="submit" className="w-full bg-primary text-on-primary font-bold py-3 mt-4 rounded-xl hover:bg-surface-tint transition-all shadow-md active:scale-[0.98]">
            {isLoading ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </div>
    </div>
  );
}
