"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
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

export default function ModelAnalyticsPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [isLoading, setIsLoading] = useState(true);

  // Mock model info based on ID
  const modelInfo = (
    {
      'm1': { name: 'GPT-4 Turbo', provider: 'OpenAI' },
      'm2': { name: 'Claude 3 Opus', provider: 'Anthropic' },
      'm3': { name: 'Llama 3 70B', provider: 'Meta' },
    } as Record<string, { name: string; provider: string }>
  )[id] || { name: 'Unknown Model', provider: 'Unknown' };

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [id]);

  // Chart Setup
  const labels = Array.from({length: 30}, (_, i) => `Day ${i+1}`);
  const tokensData = Array.from({length: 30}, () => Math.floor(Math.random() * 200000) + 50000);
  
  const chartData = {
    labels,
    datasets: [
      {
        fill: true,
        label: 'Tokens Processed',
        data: tokensData,
        borderColor: '#11100d',
        backgroundColor: 'rgba(17, 16, 13, 0.05)',
        tension: 0.4,
        pointRadius: 2,
        pointBackgroundColor: '#11100d',
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(17, 16, 13, 0.9)',
        titleFont: { family: 'Inter', size: 13 },
        bodyFont: { family: 'Inter', size: 12 },
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(17, 16, 13, 0.05)',
          drawBorder: false,
        },
        ticks: {
          font: { family: 'Inter', size: 11 },
          color: '#65635f',
          callback: (value: any) => (value / 1000) + 'k'
        }
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          font: { family: 'Inter', size: 11 },
          color: '#65635f',
          maxTicksLimit: 10
        }
      }
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <span className="material-symbols-outlined text-4xl animate-spin text-primary">sync</span>
      </div>
    );
  }

  return (
    <div className="max-w-container-max mx-auto space-y-lg pb-8 animate-in fade-in duration-300">
      <div className="flex items-center gap-4 mb-4">
        <Link 
          href="/admin/models" 
          className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface-variant cursor-pointer"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <div>
          <h2 className="font-headline-xl text-headline-xl text-primary tracking-tight">
            {modelInfo.name} Analytics
          </h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            Performance and token usage metrics for {modelInfo.provider} API
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-surface-container-lowest border border-outline-variant rounded-[16px] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined">data_usage</span>
          </div>
          <div>
            <p className="text-on-surface-variant font-label-sm text-xs uppercase tracking-wider mb-1">Total Tokens (30d)</p>
            <p className="text-2xl font-bold text-on-surface">3.8M</p>
          </div>
        </div>
        <div className="p-6 bg-surface-container-lowest border border-outline-variant rounded-[16px] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-[#E8F5E9] text-[#2E7D32] rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined">speed</span>
          </div>
          <div>
            <p className="text-on-surface-variant font-label-sm text-xs uppercase tracking-wider mb-1">Avg Latency</p>
            <p className="text-2xl font-bold text-on-surface">840ms</p>
          </div>
        </div>
        <div className="p-6 bg-surface-container-lowest border border-outline-variant rounded-[16px] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-[#E3F2FD] text-[#1565C0] rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined">payments</span>
          </div>
          <div>
            <p className="text-on-surface-variant font-label-sm text-xs uppercase tracking-wider mb-1">Est. API Cost (30d)</p>
            <p className="text-2xl font-bold text-on-surface">$124.50</p>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-[16px] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-outline-variant">
          <h3 className="font-headline-sm text-on-surface">Token Consumption</h3>
          <p className="text-on-surface-variant font-body-sm text-sm">30-day historical usage volume</p>
        </div>
        <div className="p-6">
          <div className="h-[400px] w-full">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}
