'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';
import { GlassCard, RippleButton } from '@/components/ui/shared';
import { Calendar, Download, RefreshCw, TrendingUp } from 'lucide-react';

const analyticsData = [
  { date: '2024-12-01', visitors: 4000, signups: 240, active: 2400 },
  { date: '2024-12-02', visitors: 4500, signups: 290, active: 2800 },
  { date: '2024-12-03', visitors: 4200, signups: 200, active: 2600 },
  { date: '2024-12-04', visitors: 5000, signups: 320, active: 3100 },
  { date: '2024-12-05', visitors: 5500, signups: 380, active: 3400 },
  { date: '2024-12-06', visitors: 5800, signups: 410, active: 3800 },
  { date: '2024-12-07', visitors: 6200, signups: 480, active: 4100 },
];

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('7d');

  const exportPDF = () => {
    toast.promise(
      new Promise(r => setTimeout(r, 1500)),
      {
        loading: 'Generating PDF report...',
        success: 'PDF downloaded successfully!',
        error: 'Export failed',
      }
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Top action bar */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-bold text-text-primary">System Analytics</h2>
          <p className="text-xs text-text-muted">Track user events, load averages, and task conversion percentages.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-surface p-1 rounded-xl border border-border text-xs">
            {['24h', '7d', '30d', '90d'].map(r => (
              <button
                key={r}
                onClick={() => setDateRange(r)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${dateRange === r ? 'bg-accent text-white' : 'text-text-muted hover:text-text-primary'}`}
              >
                {r}
              </button>
            ))}
          </div>
          <button onClick={exportPDF} className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5">
            <Download size={14} /> Export PDF
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Visits', val: '35.4K', change: '+14.2%', up: true },
          { label: 'Total Signups', val: '2,331', change: '+8.1%', up: true },
          { label: 'Active Workspaces', val: '412', change: '-1.5%', up: false },
        ].map((kpi, idx) => (
          <GlassCard key={idx} className="p-5 flex flex-col justify-between" hover>
            <span className="text-xs text-text-muted">{kpi.label}</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-bold">{kpi.val}</span>
              <span className={`text-xs font-semibold ${kpi.up ? 'text-emerald-400' : 'text-red-400'}`}>{kpi.change}</span>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6" hover={false}>
          <h3 className="text-sm font-semibold mb-4 text-text-primary">Traffic Overview (Visitors)</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <AreaChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={10} />
                <YAxis stroke="var(--text-muted)" fontSize={10} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }} />
                <Area type="monotone" dataKey="visitors" stroke="var(--accent)" fill="rgba(124, 58, 237, 0.15)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="p-6" hover={false}>
          <h3 className="text-sm font-semibold mb-4 text-text-primary">Signups Trend</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <BarChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={10} />
                <YAxis stroke="var(--text-muted)" fontSize={10} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }} />
                <Bar dataKey="signups" fill="rgba(6, 182, 212, 0.5)" stroke="#06b6d4" strokeWidth={1} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="p-6 lg:col-span-2" hover={false}>
          <h3 className="text-sm font-semibold mb-4 text-text-primary">System Load Ratio</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <LineChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={10} />
                <YAxis stroke="var(--text-muted)" fontSize={10} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }} />
                <Line type="monotone" dataKey="active" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
