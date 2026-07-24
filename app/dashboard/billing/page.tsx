"use client";

import { useEffect, useState } from 'react';
import { UserService } from '../../../services/user.service';
import { ExportService } from '../../../services/export.service';

export default function BillingPage() {
  const [billing, setBilling] = useState<any>(null);

  useEffect(() => {
    async function loadBilling() {
      try {
        const data = await UserService.fetchBilling();
        setBilling(data);
      } catch (err) {
        console.error(err);
      }
    }
    loadBilling();
  }, []);

  if (!billing) return <div className="p-8">Loading billing info...</div>;

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Usage & Billing</h1>
      
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6">
          <h3 className="text-sm font-bold text-on-surface-variant uppercase mb-4">Current Plan</h3>
          <div className="text-4xl font-bold text-primary mb-2">{billing.currentPlan}</div>
          <p className="text-on-surface-variant mb-4">Status: <span className="text-green-600 font-bold">{billing.status}</span></p>
          <button className="w-full bg-primary text-white font-bold py-2 rounded-lg">Upgrade Plan</button>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6">
          <h3 className="text-sm font-bold text-on-surface-variant uppercase mb-4">API Usage</h3>
          <div className="flex justify-between items-end mb-2">
            <span className="text-2xl font-bold">{billing.apiUsage.used.toLocaleString()}</span>
            <span className="text-on-surface-variant">/ {billing.apiUsage.limit.toLocaleString()} tokens</span>
          </div>
          <div className="w-full bg-surface-container h-4 rounded-full overflow-hidden mb-4">
            <div 
              className="h-full bg-primary" 
              style={{ width: `${billing.apiUsage.percentage}%` }}
            ></div>
          </div>
          <p className="text-sm text-on-surface-variant">Resets on {new Date(billing.nextBillingDate).toLocaleDateString()}</p>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Recent Invoices</h2>
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-surface-container">
            <tr>
              <th className="p-4 text-xs uppercase font-bold text-on-surface-variant">Invoice ID</th>
              <th className="p-4 text-xs uppercase font-bold text-on-surface-variant">Date</th>
              <th className="p-4 text-xs uppercase font-bold text-on-surface-variant">Amount</th>
              <th className="p-4 text-xs uppercase font-bold text-on-surface-variant">Status</th>
              <th className="p-4 text-xs uppercase font-bold text-on-surface-variant text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {billing.recentInvoices.map((inv: any) => (
              <tr key={inv.id} className="border-b border-outline-variant last:border-0">
                <td className="p-4 font-bold">{inv.id}</td>
                <td className="p-4">{inv.date}</td>
                <td className="p-4">${inv.amount}</td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-lg text-xs font-bold">{inv.status}</span>
                </td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => {
                      ExportService.generatePDF(
                        `Invoice_${inv.id}`,
                        'BILLING INVOICE',
                        `Invoice ID: ${inv.id} - ${inv.date}`,
                        ['Description', 'Amount', 'Status'],
                        [['API Usage Plan', `$${inv.amount}`, inv.status]],
                        {
                          "Total Due": `$${inv.amount}`,
                          "Status": inv.status
                        }
                      );
                    }}
                    className="text-primary hover:bg-surface-container p-2 rounded-full transition-colors flex items-center justify-center ml-auto"
                    title="Download PDF"
                  >
                    <span className="material-symbols-outlined text-[20px]">download</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
