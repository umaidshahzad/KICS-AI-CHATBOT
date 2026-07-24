"use client";

export default function HelpCenterPage() {
  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Help Center</h1>
      
      <div className="relative mb-8">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
        <input 
          type="text" 
          placeholder="Search for articles, guides, or FAQs..." 
          className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl pl-12 pr-4 py-4 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary shadow-sm"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 hover:border-primary transition-colors cursor-pointer">
          <span className="material-symbols-outlined text-4xl text-primary mb-4">library_books</span>
          <h2 className="text-xl font-bold mb-2">Documentation</h2>
          <p className="text-on-surface-variant text-sm">Read guides and tutorials on how to use AI Studio.</p>
        </div>
        
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 hover:border-primary transition-colors cursor-pointer">
          <span className="material-symbols-outlined text-4xl text-primary mb-4">forum</span>
          <h2 className="text-xl font-bold mb-2">Community Forum</h2>
          <p className="text-on-surface-variant text-sm">Join the community and ask questions.</p>
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div className="border-b border-outline-variant pb-4">
            <h3 className="font-bold mb-2">How do I upgrade my plan?</h3>
            <p className="text-sm text-on-surface-variant">You can upgrade your plan by navigating to the Billing section and selecting 'Upgrade Plan'.</p>
          </div>
          <div className="border-b border-outline-variant pb-4">
            <h3 className="font-bold mb-2">How are tokens calculated?</h3>
            <p className="text-sm text-on-surface-variant">Tokens represent words or pieces of words. Approximately 1 token equals 4 characters in English.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
