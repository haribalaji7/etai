'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Bar, Line } from 'recharts';
import toast from 'react-hot-toast';
import { AnimatedCounter, GlassCard, StatusBadge, RippleButton, SkeletonCard, SkeletonBlock } from '@/components/ui/shared';
import { revenueData, userGrowthData, generateAuditLogs, sampleUsers } from '@/lib/data';
import { SmartSuggestions } from '@/components/ai/SmartSuggestions';
import { TrendingUp, TrendingDown, Users, DollarSign, Brain, GitBranch, AlertCircle, CheckCircle2, UserPlus, FileDown } from 'lucide-react';

const DynamicHealthWidget = dynamic(() => import('@/components/three/scenes').then(m => {
  const { Scene3D, AIHealthSphere } = m;
  return function HealthWidget({ load }: { load: number }) {
    return (
      <div className="w-full h-48 relative">
        <Scene3D className="!absolute inset-0 w-full h-full">
          <AIHealthSphere load={load} />
        </Scene3D>
      </div>
    );
  };
}), { ssr: false, loading: () => <div className="w-full h-48 skeleton rounded-xl" /> });

const List = dynamic(() => import('react-window').then((mod) => mod.List as any), { ssr: false }) as any;

const sparklineData = [
  [{ v: 30 }, { v: 40 }, { v: 35 }, { v: 50 }, { v: 49 }, { v: 60 }, { v: 70 }],
  [{ v: 10 }, { v: 15 }, { v: 8 }, { v: 22 }, { v: 18 }, { v: 25 }, { v: 30 }],
  [{ v: 92 }, { v: 93 }, { v: 91 }, { v: 94 }, { v: 93 }, { v: 94.2 }, { v: 94.2 }],
  [{ v: 20 }, { v: 25 }, { v: 22 }, { v: 30 }, { v: 28 }, { v: 35 }, { v: 38 }],
];

interface Activity {
  id: string;
  type: 'user' | 'task' | 'alert';
  text: string;
  time: string;
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<Activity[]>([
    { id: '1', type: 'user', text: 'Marcus Williams joined Sales', time: 'Just now' },
    { id: '2', type: 'task', text: 'AI Auditor completed Compliance check', time: '2m ago' },
    { id: '3', type: 'alert', text: 'Orchestrator queue load exceeded 85%', time: '5m ago' },
  ]);
  const [healthLoad, setHealthLoad] = useState(0.4);
  const [auditLogs] = useState(() => generateAuditLogs(1000));
  const [sortField, setSortField] = useState<'user' | 'action' | 'timestamp'>('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Live Activity Feed Simulation
  useEffect(() => {
    if (loading) return;
    const interval = setInterval(() => {
      const types: ('user' | 'task' | 'alert')[] = ['user', 'task', 'alert'];
      const randomType = types[Math.floor(Math.random() * types.length)];
      const names = sampleUsers.map(u => u.name);
      const randomName = names[Math.floor(Math.random() * names.length)];

      let text = '';
      if (randomType === 'user') text = `${randomName} accessed Document Manager`;
      else if (randomType === 'task') text = `Task completed by Coder Agent`;
      else text = `Database replication latency warning`;

      const newActivity: Activity = {
        id: Math.random().toString(),
        type: randomType,
        text,
        time: 'Just now'
      };

      setActivities(prev => [newActivity, ...prev.slice(0, 7)]);
      setHealthLoad(Math.random());
    }, 3000);

    return () => clearInterval(interval);
  }, [loading]);

  const sortedLogs = useMemo(() => {
    return [...auditLogs].sort((a, b) => {
      const fieldA = a[sortField];
      const fieldB = b[sortField];
      if (fieldA < fieldB) return sortOrder === 'asc' ? -1 : 1;
      if (fieldA > fieldB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [auditLogs, sortField, sortOrder]);

  const exportCSV = () => {
    const headers = 'ID,User,Action,Timestamp,Status,IP\n';
    const rows = auditLogs.map(log => `${log.id},${log.user},${log.action},${log.timestamp},${log.status},${log.ip}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `audit-logs-${new Date().toISOString().split('T')[0]}.csv`);
    a.click();
    toast.success('Audit logs exported successfully');
  };

  if (loading) {
    return <PageSkeleton />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* ROW 1: 4 KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Revenue', value: 2400000, prefix: '$', suffix: '', change: '+12.5%', up: true, icon: DollarSign, color: 'text-violet-400 bg-violet-500/10 border-violet-500/20' },
          { title: 'Active Users', value: 1247, prefix: '', suffix: '', change: '+4.8%', up: true, icon: Users, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
          { title: 'AI Accuracy', value: 94.2, prefix: '', suffix: '%', decimals: 1, change: '+0.5%', up: true, icon: Brain, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
          { title: 'Workflows Run', value: 38, prefix: '', suffix: '', change: '-2.1%', up: false, icon: GitBranch, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
        ].map((card, i) => (
          <GlassCard key={i} className="p-5 flex flex-col justify-between" hover>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-xl border ${card.color}`}>
                <card.icon size={20} />
              </div>
              <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${card.up ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                {card.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {card.change}
              </span>
            </div>
            <div>
              <span className="text-sm text-text-muted">{card.title}</span>
              <h3 className="text-2xl font-bold mt-1">
                <AnimatedCounter value={card.value} prefix={card.prefix} suffix={card.suffix} decimals={card.decimals} />
              </h3>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* ROW 2: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6" hover={false}>
          <h3 className="text-base font-semibold mb-4 text-text-primary">Monthly Revenue Dynamics</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }} />
                <Area type="monotone" dataKey="revenue" stroke="var(--accent)" fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="p-6" hover={false}>
          <h3 className="text-base font-semibold mb-4 text-text-primary">User Growth vs Churn</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <ComposedChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }} />
                <Bar dataKey="newUsers" fill="rgba(124, 58, 237, 0.4)" stroke="var(--accent)" radius={[4, 4, 0, 0]} />
                <Line type="monotone" dataKey="churn" stroke="#ef4444" strokeWidth={2} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* ROW 3: Three Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Live Activity Feed */}
        <GlassCard className="p-6 lg:col-span-5 flex flex-col" hover={false}>
          <h3 className="text-base font-semibold mb-4">Live Activity Feed</h3>
          <div className="flex-1 space-y-3 max-h-[300px] overflow-y-auto pr-1">
            <AnimatePresence initial={false}>
              {activities.map(act => (
                <motion.div
                  key={act.id}
                  layout
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-3 p-3 bg-white/5 border border-white/5 rounded-xl text-xs"
                >
                  <div className={`p-1.5 rounded-full ${
                    act.type === 'user' ? 'bg-emerald-500/10 text-emerald-400' :
                    act.type === 'task' ? 'bg-blue-500/10 text-blue-400' :
                    'bg-red-500/10 text-red-400'
                  }`}>
                    {act.type === 'user' && <UserPlus size={14} />}
                    {act.type === 'task' && <CheckCircle2 size={14} />}
                    {act.type === 'alert' && <AlertCircle size={14} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-text-primary truncate">{act.text}</p>
                    <span className="text-text-muted text-[10px]">{act.time}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </GlassCard>

        {/* AI Health Widget */}
        <GlassCard className="p-6 lg:col-span-4 flex flex-col justify-between" hover={false}>
          <h3 className="text-base font-semibold">AI Health Status</h3>
          <DynamicHealthWidget load={healthLoad} />
          <div className="space-y-3 mt-4">
            <div>
              <div className="flex justify-between text-xs text-text-muted mb-1">
                <span>Orchestrator Accuracy</span>
                <span>{(94.2 + (healthLoad * 0.5 - 0.25)).toFixed(1)}%</span>
              </div>
              <div className="h-1.5 bg-surface rounded-full overflow-hidden">
                <div className="h-full bg-accent rounded-full" style={{ width: '94%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-text-muted mb-1">
                <span>Response Latency</span>
                <span>{(180 + healthLoad * 100).toFixed(0)}ms</span>
              </div>
              <div className="h-1.5 bg-surface rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400 rounded-full" style={{ width: '80%' }} />
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Quick Actions */}
        <GlassCard className="p-6 lg:col-span-3" hover={false}>
          <h3 className="text-base font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3 h-full">
            {[
              { label: 'Add User', icon: '👤', path: '/hr' },
              { label: 'New Flow', icon: '⚡', path: '/workflows/builder' },
              { label: 'Analytics', icon: '📈', path: '/analytics' },
              { label: 'Documents', icon: '📁', path: '/documents' },
              { label: 'Settings', icon: '⚙️', path: '/settings' },
              { label: 'Help', icon: '❓', path: '/help' },
            ].map((act, i) => (
              <RippleButton
                key={i}
                onClick={() => window.location.href = act.path}
                className="glass !bg-white/5 hover:!bg-white/10 p-4 !rounded-xl flex flex-col items-center justify-center text-center transition-all hover:glow-border"
              >
                <span className="text-xl mb-1">{act.icon}</span>
                <span className="text-xs font-semibold text-text-muted">{act.label}</span>
              </RippleButton>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Smart Suggestions Row */}
      <SmartSuggestions />

      {/* ROW 4: Audit Logs Data Table */}
      <GlassCard className="p-6" hover={false}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold">System Audit Logs</h3>
          <RippleButton onClick={exportCSV} className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2">
            <FileDown size={14} /> Export Logs
          </RippleButton>
        </div>

        <div className="border border-border rounded-xl overflow-hidden bg-surface">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-border bg-card text-xs font-semibold text-text-muted">
            <button className="col-span-3 text-left hover:text-text-primary" onClick={() => { setSortField('user'); setSortOrder(o => o === 'asc' ? 'desc' : 'asc'); }}>User</button>
            <button className="col-span-4 text-left hover:text-text-primary" onClick={() => { setSortField('action'); setSortOrder(o => o === 'asc' ? 'desc' : 'asc'); }}>Action</button>
            <button className="col-span-3 text-left hover:text-text-primary" onClick={() => { setSortField('timestamp'); setSortOrder(o => o === 'asc' ? 'desc' : 'asc'); }}>Timestamp</button>
            <div className="col-span-2 text-right">Status</div>
          </div>
          <List
            style={{ height: 300, width: '100%' }}
            rowCount={sortedLogs.length}
            rowHeight={48}
            rowProps={{ sortedLogs }}
            rowComponent={({ index, style, sortedLogs }: any) => {
              const log = sortedLogs[index];
              return (
                <div style={style} className="grid grid-cols-12 gap-4 px-4 items-center border-b border-border/50 text-xs hover:bg-white/5 transition-colors">
                  <span className="col-span-3 font-medium truncate">{log.user}</span>
                  <span className="col-span-4 text-text-muted truncate">{log.action}</span>
                  <span className="col-span-3 text-text-muted truncate">{new Date(log.timestamp).toLocaleString()}</span>
                  <div className="col-span-2 text-right">
                    <StatusBadge status={log.status} />
                  </div>
                </div>
              );
            }}
          />
        </div>
      </GlassCard>
    </div>
  );
}

function PageSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6"><SkeletonBlock className="h-80 w-full" /></GlassCard>
        <GlassCard className="p-6"><SkeletonBlock className="h-80 w-full" /></GlassCard>
      </div>
    </div>
  );
}
