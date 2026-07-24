import { NextResponse } from 'next/server';

const mockBilling = {
  currentPlan: 'Pro',
  status: 'Active',
  billingCycle: 'Monthly',
  nextBillingDate: '2026-08-23T00:00:00Z',
  apiUsage: {
    used: 45000,
    limit: 100000,
    percentage: 45
  },
  recentInvoices: [
    { id: 'INV-1234', date: '2026-07-23', amount: 29.99, status: 'Paid' },
    { id: 'INV-1233', date: '2026-06-23', amount: 29.99, status: 'Paid' }
  ]
};

export async function GET() {
  return NextResponse.json(mockBilling);
}
