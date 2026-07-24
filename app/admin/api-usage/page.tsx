"use client";

import { useEffect, useState, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { AdminService } from '../../../services/admin.service';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export default function ApiUsagePage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    }, 1500);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const usersData = await AdminService.getUsers();
        setUsers(usersData);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <span className="material-symbols-outlined text-4xl animate-spin text-primary">sync</span>
      </div>
    );
  }

  // Chart Setup
  const labels = Array.from({length: 30}, (_, i) => `Day ${i+1}`);
  const apiCallsData = Array.from({length: 30}, () => Math.floor(Math.random() * 500000) + 200000);
  
  const chartData = {
    labels,
    datasets: [
      {
        fill: true,
        label: 'API Calls',
        data: apiCallsData,
        borderColor: '#11100d',
        backgroundColor: 'rgba(17, 16, 13, 0.05)',
        borderWidth: 2,
        pointBackgroundColor: '#e9c176',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#11100d',
        titleFont: { family: 'Manrope', size: 14 },
        bodyFont: { family: 'Manrope', size: 14 },
        padding: 12,
        cornerRadius: 8,
        displayColors: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#e6e2db',
          drawBorder: false,
        },
        ticks: {
          font: { family: 'Manrope', size: 12 },
          color: '#484740',
          callback: function(value: any) {
            return value / 1000 + 'k';
          }
        }
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          font: { family: 'Manrope', size: 12 },
          color: '#484740',
          maxTicksLimit: 10
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
  };

  const totalTokens = users.reduce((acc, curr) => acc + (curr.tokensUsed || 0), 0);
  const totalCalls = Math.floor(totalTokens / 3); // Dummy correlation

  return (
    <div className="max-w-container-max mx-auto space-y-lg pb-8">
      {/* Header Section */}
      <header className="mb-section-gap flex justify-between items-end">
        <div>
          <h2 className="font-headline-xl text-headline-xl text-primary tracking-tight">API Usage Statistics</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-2">Monitor network performance, token consumption, and user activity over the last 30 days.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleExport}
            disabled={exporting || exportSuccess}
            className={`px-6 py-3 border border-outline-variant rounded-[8px] font-label-md text-label-md text-on-surface hover:bg-surface-container-high transition-colors flex items-center gap-2 ${exportSuccess ? 'border-primary text-primary' : 'bg-surface-container-lowest shadow-sm'}`}
          >
            {exporting ? (
              <><span className="material-symbols-outlined animate-spin text-[20px]">sync</span> Exporting...</>
            ) : exportSuccess ? (
              <><span className="material-symbols-outlined text-[20px]">check</span> Exported!</>
            ) : (
              <>Export Report</>
            )}
          </button>
        </div>
      </header>

      {/* Metrics Overview (Bento Style) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-section-gap">
        <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-outline-variant/30 flex flex-col justify-between h-40 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-6">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Total API Calls</span>
            <span className="material-symbols-outlined text-secondary">swap_vert</span>
          </div>
          <div>
            <div className="font-headline-xl text-headline-xl text-primary">{(totalCalls / 1000000).toFixed(1)}M</div>
            <div className="flex items-center gap-2 mt-2 font-label-md text-label-md">
              <span className="text-green-600 flex items-center"><span className="material-symbols-outlined text-sm mr-1">trending_up</span> +8.2%</span>
              <span className="text-on-surface-variant">vs last month</span>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-outline-variant/30 flex flex-col justify-between h-40 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-6">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Total Tokens Consumed</span>
            <span className="material-symbols-outlined text-secondary">data_usage</span>
          </div>
          <div>
            <div className="font-headline-xl text-headline-xl text-primary">{(totalTokens / 1000000).toFixed(1)}M</div>
            <div className="flex items-center gap-2 mt-2 font-label-md text-label-md">
              <span className="text-green-600 flex items-center"><span className="material-symbols-outlined text-sm mr-1">trending_up</span> +12.5%</span>
              <span className="text-on-surface-variant">vs last month</span>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-outline-variant/30 flex flex-col justify-between h-40 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-6">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Active Users (30d)</span>
            <span className="material-symbols-outlined text-secondary">group</span>
          </div>
          <div>
            <div className="font-headline-xl text-headline-xl text-primary">{users.length}</div>
            <div className="flex items-center gap-2 mt-2 font-label-md text-label-md">
              <span className="text-red-600 flex items-center"><span className="material-symbols-outlined text-sm mr-1">trending_down</span> -1.2%</span>
              <span className="text-on-surface-variant">vs last month</span>
            </div>
          </div>
        </div>
      </section>

      {/* Chart Section */}
      <section className="bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-outline-variant/30 mb-section-gap relative">
        <h3 className="font-headline-md text-headline-md text-primary mb-6">Usage Trends (30 Days)</h3>
        <div className="h-80 w-full relative">
          <Line data={chartData} options={chartOptions} />
        </div>
      </section>

      {/* User Data Table */}
      <section className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
        {/* Table Header / Filters */}
        <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
          <h3 className="font-headline-md text-headline-md text-primary">User Activity</h3>
          <div className="flex gap-4">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
              <input 
                className="pl-10 pr-4 py-2 bg-surface-container-low border border-transparent focus:border-primary focus:ring-1 focus:ring-primary rounded-[8px] font-body-md text-body-md w-64 placeholder:text-on-surface-variant/70 text-primary outline-none transition-all" 
                placeholder="Search users..." 
                type="text" 
              />
            </div>
            <button className="px-4 py-2 border border-outline-variant text-on-surface rounded-[8px] font-label-md text-label-md hover:bg-surface-container-high transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">filter_list</span>
              Filter
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold border-b border-outline-variant">User Name</th>
                <th className="px-6 py-4 font-semibold border-b border-outline-variant">Role</th>
                <th className="px-6 py-4 font-semibold border-b border-outline-variant">API Calls (30d)</th>
                <th className="px-6 py-4 font-semibold border-b border-outline-variant">Tokens Used</th>
                <th className="px-6 py-4 font-semibold border-b border-outline-variant text-right">Status</th>
              </tr>
            </thead>
            <tbody className="font-body-md text-body-md text-primary divide-y divide-outline-variant/50">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-surface-container-highest text-primary flex items-center justify-center font-bold text-sm">
                      {u.name.charAt(0)}
                    </div>
                    <span className="font-medium">{u.name}</span>
                  </td>
                  <td className="px-6 py-4 text-on-surface-variant capitalize">{u.role}</td>
                  <td className="px-6 py-4 font-medium">{(Math.floor(u.tokensUsed / 3)).toLocaleString()}</td>
                  <td className="px-6 py-4 text-on-surface-variant">{u.tokensUsed.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right">
                    {u.status === 'active' ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full bg-[#E8F5E9] text-[#2E7D32] font-label-sm text-label-sm border border-[#C8E6C9]">Active</span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full bg-surface-variant text-on-surface-variant font-label-sm text-label-sm border border-outline-variant">Inactive</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
