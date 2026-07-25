"use client";

import { useEffect, useState } from 'react';
import { UserService } from '../../../services/user.service';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function UsagePage() {
  const [usageData, setUsageData] = useState<any>(null);

  useEffect(() => {
    async function loadUsage() {
      try {
        const data = await UserService.fetchBilling(); // We can keep using fetchBilling from the service for now
        setUsageData(data);
      } catch (err) {
        console.error(err);
      }
    }
    loadUsage();
  }, []);

  if (!usageData) return <div className="p-8 text-on-background">Loading usage info...</div>;

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-on-background">Activity Analytics</h1>
      
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-0"></div>
          <h3 className="text-sm font-bold text-on-surface-variant uppercase mb-4 relative z-10">Assigned Model</h3>
          <div className="text-3xl md:text-4xl font-bold text-primary mb-2 relative z-10 flex items-center gap-3">
            <span className="material-symbols-outlined text-[32px] md:text-[40px]">memory</span>
            {usageData.assignedModel}
          </div>
          <p className="text-on-surface-variant mb-4 relative z-10">Status: <span className="text-green-600 font-bold">{usageData.status}</span></p>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6">
          <h3 className="text-sm font-bold text-on-surface-variant uppercase mb-4">Total Tokens Used</h3>
          <div className="flex justify-between items-end mb-2">
            <span className="text-2xl font-bold text-on-background">{usageData.apiUsage.used.toLocaleString()}</span>
            <span className="text-on-surface-variant">/ {usageData.apiUsage.limit.toLocaleString()} tokens</span>
          </div>
          <div className="w-full bg-surface-container h-4 rounded-full overflow-hidden mb-4">
            <div 
              className={`h-full transition-all duration-1000 ${usageData.apiUsage.percentage > 90 ? 'bg-error' : 'bg-primary'}`}
              style={{ width: `${usageData.apiUsage.percentage}%` }}
            ></div>
          </div>
          <p className="text-sm text-on-surface-variant">
            {usageData.apiUsage.percentage >= 100 
              ? <span className="text-error font-bold">Limit reached. Contact admin for more tokens.</span>
              : 'Keep an eye on your usage limits.'}
          </p>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4 text-on-background">7-Day Usage History</h2>
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={usageData.dailyUsage} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="date" stroke="var(--color-on-surface-variant)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--color-on-surface-variant)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val / 1000}k`} />
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-outline-variant)" opacity={0.3} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--color-surface-container)', borderColor: 'var(--color-outline-variant)', borderRadius: '8px', color: 'var(--color-on-background)' }}
              itemStyle={{ color: 'var(--color-primary)' }}
            />
            <Area 
              type="monotone" 
              dataKey="tokens" 
              stroke="var(--color-primary)" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorTokens)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
