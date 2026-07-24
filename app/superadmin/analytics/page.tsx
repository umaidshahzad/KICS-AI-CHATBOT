"use client";

import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const data30D = [
  { name: 'Oct 1', revenue: 50000 },
  { name: 'Oct 8', revenue: 60000 },
  { name: 'Oct 15', revenue: 40000 },
  { name: 'Oct 22', revenue: 130000 },
  { name: 'Oct 29', revenue: 110000 },
  { name: 'Oct 30', revenue: 180000 },
];

const data90D = [
  { name: 'Aug', revenue: 120000 },
  { name: 'Sep', revenue: 210000 },
  { name: 'Oct', revenue: 180000 },
];

const data1Y = [
  { name: 'Q1', revenue: 300000 },
  { name: 'Q2', revenue: 500000 },
  { name: 'Q3', revenue: 450000 },
  { name: 'Q4', revenue: 800000 },
];

export default function SuperAdminAnalyticsPage() {
  const [timePeriod, setTimePeriod] = useState<'30D' | '90D' | '1Y'>('30D');

  const getChartData = () => {
    switch(timePeriod) {
      case '90D': return data90D;
      case '1Y': return data1Y;
      case '30D': default: return data30D;
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto w-full flex-1 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h2 className="font-headline-xl text-3xl md:text-4xl font-bold text-primary tracking-tight">Global Analytics</h2>
        <p className="font-body-lg text-lg text-on-surface-variant max-w-2xl">High-level performance metrics and usage distribution across the global infrastructure.</p>
      </div>

      {/* KPIs Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI 1: Total Revenue */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex flex-col justify-between min-h-[160px] group hover:-translate-y-1 transition-transform duration-300 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <span className="font-label-md text-on-surface-variant uppercase tracking-wider font-bold text-xs">Total Revenue</span>
            <span className="material-symbols-outlined text-primary bg-primary/10 p-1.5 rounded-md text-[18px]">payments</span>
          </div>
          <div>
            <div className="font-headline-xl text-3xl font-bold text-primary">$4.2M</div>
            <div className="flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined text-[16px] text-green-600">trending_up</span>
              <span className="font-label-sm text-green-600 font-bold text-xs">+12.5% vs last month</span>
            </div>
          </div>
        </div>

        {/* KPI 2: MAU */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex flex-col justify-between min-h-[160px] group hover:-translate-y-1 transition-transform duration-300 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <span className="font-label-md text-on-surface-variant uppercase tracking-wider font-bold text-xs">Monthly Active Users</span>
            <span className="material-symbols-outlined text-primary bg-primary/10 p-1.5 rounded-md text-[18px]">group</span>
          </div>
          <div>
            <div className="font-headline-xl text-3xl font-bold text-primary">845K</div>
            <div className="flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined text-[16px] text-green-600">trending_up</span>
              <span className="font-label-sm text-green-600 font-bold text-xs">+5.2% vs last month</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Avg Response Time */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex flex-col justify-between min-h-[160px] group hover:-translate-y-1 transition-transform duration-300 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <span className="font-label-md text-on-surface-variant uppercase tracking-wider font-bold text-xs">Avg Response Time</span>
            <span className="material-symbols-outlined text-primary bg-primary/10 p-1.5 rounded-md text-[18px]">speed</span>
          </div>
          <div>
            <div className="font-headline-xl text-3xl font-bold text-primary">124<span className="text-xl text-on-surface-variant ml-1 font-normal">ms</span></div>
            <div className="flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined text-[16px] text-green-600">trending_down</span>
              <span className="font-label-sm text-green-600 font-bold text-xs">-8ms vs last month</span>
            </div>
          </div>
        </div>

        {/* KPI 4: Error Rate */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex flex-col justify-between min-h-[160px] group hover:-translate-y-1 transition-transform duration-300 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <span className="font-label-md text-on-surface-variant uppercase tracking-wider font-bold text-xs">Error Rate</span>
            <span className="material-symbols-outlined text-primary bg-primary/10 p-1.5 rounded-md text-[18px]">error</span>
          </div>
          <div>
            <div className="font-headline-xl text-3xl font-bold text-primary">0.04<span className="text-xl text-on-surface-variant ml-1 font-normal">%</span></div>
            <div className="flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined text-[16px] text-on-surface-variant">horizontal_rule</span>
              <span className="font-label-sm text-on-surface-variant font-bold text-xs">Stable</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trends (Spans 2 columns) */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 lg:col-span-2 flex flex-col h-[400px] shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline-md text-xl font-bold text-on-surface">Revenue Trends</h3>
            <div className="flex items-center gap-2 bg-surface-container-low p-1 rounded-lg border border-outline-variant">
              <button onClick={() => setTimePeriod('30D')} className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${timePeriod === '30D' ? 'bg-surface shadow-sm text-primary' : 'text-on-surface-variant hover:text-primary'}`}>30D</button>
              <button onClick={() => setTimePeriod('90D')} className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${timePeriod === '90D' ? 'bg-surface shadow-sm text-primary' : 'text-on-surface-variant hover:text-primary'}`}>90D</button>
              <button onClick={() => setTimePeriod('1Y')} className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${timePeriod === '1Y' ? 'bg-surface shadow-sm text-primary' : 'text-on-surface-variant hover:text-primary'}`}>1Y</button>
            </div>
          </div>
          <div className="flex-1 w-full h-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={getChartData()} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3f3f46" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} tickFormatter={(value) => `$${value / 1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderRadius: '8px', border: '1px solid #3f3f46' }}
                  itemStyle={{ color: '#d4d4d8' }}
                  labelStyle={{ color: '#a1a1aa' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Usage by Region (Spans 1 column) */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex flex-col h-[400px] shadow-sm">
          <h3 className="font-headline-md text-xl font-bold text-on-surface mb-6">Usage by Region</h3>
          <div className="flex-1 relative rounded-lg overflow-hidden bg-surface-container-low border border-outline-variant group">
            <div className="absolute inset-0 bg-cover bg-center w-full h-full opacity-50 group-hover:scale-105 transition-transform duration-700 ease-out flex items-center justify-center">
              <span className="material-symbols-outlined text-[120px] text-primary/20">public</span>
            </div>
            {/* Overlay Stats */}
            <div className="absolute bottom-4 left-4 right-4 bg-surface/90 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-outline-variant space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-label-md text-sm font-bold text-on-surface">North America</span>
                <span className="font-label-md text-sm font-bold text-primary">45%</span>
              </div>
              <div className="w-full bg-surface-variant rounded-full h-1.5">
                <div className="bg-primary h-1.5 rounded-full" style={{ width: '45%' }}></div>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="font-label-md text-sm font-bold text-on-surface-variant">Europe</span>
                <span className="font-label-md text-sm font-bold text-primary">32%</span>
              </div>
              <div className="w-full bg-surface-variant rounded-full h-1.5">
                <div className="bg-primary/60 h-1.5 rounded-full" style={{ width: '32%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performing Models Table */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
          <h3 className="font-headline-md text-xl font-bold text-on-surface">Top Performing Models</h3>
          <button className="font-label-md text-sm font-bold text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
            View All <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant bg-surface">
                <th className="p-4 font-label-md font-bold text-xs text-on-surface-variant uppercase tracking-wider">Model Name</th>
                <th className="p-4 font-label-md font-bold text-xs text-on-surface-variant uppercase tracking-wider">Total Requests</th>
                <th className="p-4 font-label-md font-bold text-xs text-on-surface-variant uppercase tracking-wider">Avg Latency</th>
                <th className="p-4 font-label-md font-bold text-xs text-on-surface-variant uppercase tracking-wider">Success Rate</th>
                <th className="p-4 font-label-md font-bold text-xs text-on-surface-variant uppercase tracking-wider text-right">Revenue Generated</th>
              </tr>
            </thead>
            <tbody className="font-body-sm text-on-surface">
              <tr className="border-b border-outline-variant hover:bg-surface-container-low transition-colors group">
                <td className="p-4 font-bold text-primary">GPT-4 Turbo</td>
                <td className="p-4 font-code-sm">8.2B</td>
                <td className="p-4 font-code-sm">112ms</td>
                <td className="p-4 text-green-600 font-bold text-sm">99.9%</td>
                <td className="p-4 text-right font-code-sm font-bold">$2.8M</td>
              </tr>
              <tr className="border-b border-outline-variant hover:bg-surface-container-low transition-colors group">
                <td className="p-4 font-bold text-primary">Claude 3 Opus</td>
                <td className="p-4 font-code-sm">3.5B</td>
                <td className="p-4 font-code-sm">145ms</td>
                <td className="p-4 text-green-600 font-bold text-sm">99.8%</td>
                <td className="p-4 text-right font-code-sm font-bold">$1.1M</td>
              </tr>
              <tr className="border-b border-outline-variant hover:bg-surface-container-low transition-colors group">
                <td className="p-4 font-bold text-primary">Llama 3 70B</td>
                <td className="p-4 font-code-sm">2.5B</td>
                <td className="p-4 font-code-sm">85ms</td>
                <td className="p-4 text-green-600 font-bold text-sm">99.95%</td>
                <td className="p-4 text-right font-code-sm font-bold">$300K</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
