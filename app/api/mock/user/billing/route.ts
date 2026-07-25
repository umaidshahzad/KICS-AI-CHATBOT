import { NextResponse } from 'next/server';

const mockUsage = {
  assignedModel: 'GPT-4o (Standard)',
  status: 'Active',
  apiUsage: {
    used: 45000,
    limit: 100000,
    percentage: 45
  },
  dailyUsage: [
    { date: 'Jul 19', tokens: 4000 },
    { date: 'Jul 20', tokens: 6500 },
    { date: 'Jul 21', tokens: 3200 },
    { date: 'Jul 22', tokens: 8900 },
    { date: 'Jul 23', tokens: 12000 },
    { date: 'Jul 24', tokens: 7400 },
    { date: 'Jul 25', tokens: 3000 }
  ]
};

export async function GET() {
  return NextResponse.json(mockUsage);
}
