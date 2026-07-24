"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from 'recharts';
import { useState } from 'react';
import Link from 'next/link';
import { ExportService } from '../../services/export.service';

const healthData = [
  { time: '00:00', primary: 40, secondary: 70 },
  { time: '04:00', primary: 30, secondary: 60 },
  { time: '08:00', primary: 55, secondary: 85 },
  { time: '12:00', primary: 75, secondary: 65 },
  { time: '16:00', primary: 60, secondary: 45 },
  { time: '20:00', primary: 80, secondary: 55 },
  { time: '24:00', primary: 45, secondary: 70 },
];

export default function SuperAdminPlatformOverview() {
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState('csv');
  
  const handleDownloadReport = (e: React.FormEvent) => {
    e.preventDefault();
    const mockReportData = {
      generatedAt: new Date().toISOString(),
      reportType: "System Health Metrics",
      status: "Healthy",
      uptime: "99.98%",
      activeNodes: 24,
      avgLatency: "124ms"
    };
    
    const headers = ["Generated At", "Report Type", "Status", "Uptime", "Active Nodes", "Avg Latency"];
    const row = [
      mockReportData.generatedAt,
      mockReportData.reportType,
      mockReportData.status,
      mockReportData.uptime,
      mockReportData.activeNodes,
      mockReportData.avgLatency
    ];

    if (exportFormat === 'json') {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(mockReportData, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "platform_report.json");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    } else if (exportFormat === 'csv') {
      ExportService.generateCSV('platform_report', headers, [row]);
    } else if (exportFormat === 'pdf') {
      ExportService.generatePDF(
        'platform_report',
        'PLATFORM HEALTH REPORT',
        'Global Infrastructure Overview',
        headers,
        [row],
        {
          "System Uptime": "99.98%",
          "Active API Nodes": "24/24",
          "Avg Global Latency": "124ms",
          "Daily Request Vol": "14.2B"
        }
      );
    }
    
    setShowExportModal(false);
  };
  
  return (
    <div className="flex flex-col gap-8 max-w-[1440px] mx-auto w-full relative">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-headline-xl text-4xl font-bold text-on-background">Platform Overview</h2>
          <p className="font-body-md text-on-surface-variant mt-1">Real-time system health and global infrastructure oversight.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowExportModal(true)}
            className="px-4 py-2 border border-outline-variant text-on-surface rounded-lg font-label-md hover:border-primary-container hover:text-primary transition-colors"
          >
            EXPORT REPORT
          </button>
          <Link 
            href="/superadmin/deployments/new"
            className="px-4 py-2 bg-primary text-on-primary rounded-lg font-label-md hover:bg-primary/90 transition-colors shadow-sm flex items-center justify-center"
          >
            NEW DEPLOYMENT
          </Link>
        </div>
      </div>

      {/* Dashboard Grid (Bento Style) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Analytics Overview (Spans 8 cols) */}
        <div className="col-span-1 md:col-span-8 bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex flex-col shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline-md text-2xl font-bold text-on-surface">Platform Health Metrics</h3>
            <span className="material-symbols-outlined text-on-surface-variant cursor-pointer">more_vert</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6 border-b border-outline-variant pb-6">
            <div>
              <p className="font-label-md text-on-surface-variant uppercase tracking-wider text-xs">SYSTEM UPTIME</p>
              <p className="font-headline-lg text-3xl font-bold text-primary mt-2">99.98%</p>
            </div>
            <div>
              <p className="font-label-md text-on-surface-variant uppercase tracking-wider text-xs">ACTIVE API NODES</p>
              <p className="font-headline-lg text-3xl font-bold text-on-surface mt-2">24/24</p>
            </div>
            <div>
              <p className="font-label-md text-on-surface-variant uppercase tracking-wider text-xs">AVG GLOBAL LATENCY</p>
              <p className="font-headline-lg text-3xl font-bold text-on-surface mt-2">124ms</p>
            </div>
            <div>
              <p className="font-label-md text-on-surface-variant uppercase tracking-wider text-xs">DAILY REQUEST VOL</p>
              <p className="font-headline-lg text-3xl font-bold text-on-surface mt-2">14.2B</p>
            </div>
          </div>
          <div className="flex-1 min-h-[200px] w-full relative rounded-lg overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={healthData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="secondary" stroke="#9CA3AF" strokeWidth={2} strokeDasharray="5 5" fill="none" />
                <Area type="monotone" dataKey="primary" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorPrimary)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Services Health Quick Access (Spans 4 cols) */}
        <div className="col-span-1 md:col-span-4 bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex flex-col shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline-md text-2xl font-bold text-on-surface">System Services</h3>
            <button className="font-label-md text-primary hover:text-primary/80 uppercase tracking-wider text-xs font-bold">MANAGE</button>
          </div>
          <div className="space-y-4 flex-1">
            {[
              { name: 'API Gateway', status: 'Operational', color: 'bg-green-600' },
              { name: 'Inference Engine', status: 'Optimized', color: 'bg-green-600' },
              { name: 'Primary Database', status: 'Normal', color: 'bg-green-600' },
              { name: 'Asset Storage', status: 'Normal', color: 'bg-green-600' }
            ].map(service => (
              <div key={service.name} className="p-4 border border-outline-variant rounded-lg hover:border-primary/30 transition-colors cursor-pointer group bg-surface">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-body-md font-bold text-on-surface group-hover:text-primary">{service.name}</span>
                  <span className={`w-2.5 h-2.5 rounded-full ${service.color}`}></span>
                </div>
                <div className="flex justify-between text-on-surface-variant font-code-sm text-sm">
                  <span>Status: {service.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Infrastructure Status Table (Full Width) */}
        <div className="col-span-1 md:col-span-12 bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden mt-2">
          <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
            <h3 className="font-headline-md text-2xl font-bold text-on-surface">Global Infrastructure Status</h3>
            <button className="px-4 py-2 border border-outline-variant text-on-surface rounded-lg font-label-md hover:border-primary-container hover:text-primary transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">filter_list</span> FILTER
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant bg-surface">
                  <th className="p-4 font-label-md text-on-surface-variant font-bold text-xs tracking-wider">REGION</th>
                  <th className="p-4 font-label-md text-on-surface-variant font-bold text-xs tracking-wider">STATUS</th>
                  <th className="p-4 font-label-md text-on-surface-variant font-bold text-xs tracking-wider">ACTIVE NODES</th>
                  <th className="p-4 font-label-md text-on-surface-variant font-bold text-xs tracking-wider">TRAFFIC LOAD</th>
                  <th className="p-4 font-label-md text-on-surface-variant font-bold text-xs tracking-wider text-right">LATENCY</th>
                </tr>
              </thead>
              <tbody className="font-body-sm text-on-surface">
                {[
                  { region: 'North America', locations: 'US-East, US-West', status: 'Healthy', nodes: '12/12', traffic: '6.4B', latency: '42ms', color: 'text-green-600', bg: 'bg-green-100' },
                  { region: 'Europe', locations: 'EU-Central, EU-West', status: 'Healthy', nodes: '8/8', traffic: '4.1B', latency: '58ms', color: 'text-green-600', bg: 'bg-green-100' },
                  { region: 'Asia Pacific', locations: 'AP-East, AP-South', status: 'Warning', nodes: '3/4', traffic: '3.7B', latency: '185ms', color: 'text-amber-600', bg: 'bg-amber-100' }
                ].map((row, i) => (
                  <tr key={i} className="border-b border-outline-variant hover:bg-surface-container-low transition-colors group">
                    <td className="p-4">
                      <p className="font-bold text-base">{row.region}</p>
                      <p className="text-on-surface-variant text-xs mt-1">{row.locations}</p>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${row.bg} ${row.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${row.color.replace('text-', 'bg-')}`}></span>
                        {row.status}
                      </span>
                    </td>
                    <td className="p-4 font-code-sm">{row.nodes}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="font-code-sm w-12">{row.traffic}</span>
                        <div className="flex-1 h-1.5 bg-surface-variant rounded-full overflow-hidden w-24">
                          <div className={`h-full ${row.status === 'Warning' ? 'bg-amber-500' : 'bg-primary'}`} style={{ width: row.status === 'Warning' ? '85%' : '60%' }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-right font-code-sm font-medium">{row.latency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Export Report Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface">
              <h3 className="font-headline-md text-xl font-bold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined">download</span>
                Export Report
              </h3>
              <button onClick={() => setShowExportModal(false)} className="text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleDownloadReport} className="p-6 space-y-5">
              <div>
                <label className="block font-label-sm font-bold text-on-surface-variant uppercase tracking-wider mb-2">Report Type</label>
                <select className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2 text-on-surface focus:outline-none focus:border-primary">
                  <option>System Health Metrics</option>
                  <option>Global Latency Analytics</option>
                  <option>API Usage Logs</option>
                  <option>Billing Overview</option>
                </select>
              </div>

              <div>
                <label className="block font-label-sm font-bold text-on-surface-variant uppercase tracking-wider mb-2">Date Range</label>
                <select className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2 text-on-surface focus:outline-none focus:border-primary">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>This Month</option>
                  <option>Custom Range</option>
                </select>
              </div>

              <div>
                <label className="block font-label-sm font-bold text-on-surface-variant uppercase tracking-wider mb-2">Format</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="format" value="csv" checked={exportFormat === 'csv'} onChange={(e) => setExportFormat(e.target.value)} className="accent-primary" />
                    <span className="font-body-md text-on-surface">CSV</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="format" value="pdf" checked={exportFormat === 'pdf'} onChange={(e) => setExportFormat(e.target.value)} className="accent-primary" />
                    <span className="font-body-md text-on-surface">PDF</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="format" value="json" checked={exportFormat === 'json'} onChange={(e) => setExportFormat(e.target.value)} className="accent-primary" />
                    <span className="font-body-md text-on-surface">JSON</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 flex gap-3 justify-end border-t border-outline-variant mt-6">
                <button 
                  type="button" 
                  onClick={() => setShowExportModal(false)} 
                  className="px-5 py-2.5 text-on-surface-variant font-bold hover:bg-surface-container rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 bg-primary text-on-primary font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
                >
                  Download Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
