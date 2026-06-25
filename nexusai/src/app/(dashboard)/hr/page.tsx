'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { sampleUsers, User } from '@/lib/data';
import { GlassCard, Avatar, StatusBadge } from '@/components/ui/shared';
import { Search, UserPlus, Check, X, Calendar } from 'lucide-react';

interface LeaveRequest {
  id: string;
  name: string;
  type: string;
  range: string;
  status: 'pending' | 'approved' | 'rejected';
}

export default function HRPage() {
  const [employees] = useState<User[]>(() => sampleUsers);
  const [searchVal, setSearchVal] = useState('');
  const [leaves, setLeaves] = useState<LeaveRequest[]>([
    { id: '1', name: 'Marcus Williams', type: 'Annual Leave', range: 'Dec 24 - Dec 28', status: 'pending' },
    { id: '2', name: 'Aisha Mohammed', type: 'Sick Leave', range: 'Dec 18 - Dec 19', status: 'approved' },
  ]);

  const handleLeaveStatus = (id: string, status: 'approved' | 'rejected') => {
    setLeaves(prev => prev.map(l => l.id === id ? { ...l, status } : l));
    toast.success(`Leave request ${status}`);
  };

  const filteredEmployees = employees.filter(emp => emp.name.toLowerCase().includes(searchVal.toLowerCase()));

  return (
    <div className="p-6 space-y-6">
      <div className="border-b border-border pb-4">
        <h2 className="text-xl font-bold text-text-primary">Human Resources</h2>
        <p className="text-xs text-text-muted">Manage employee directory, leave requests, and track workspace attendance.</p>
      </div>

      {/* Attendance Heatmap & Leave Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Heatmap */}
        <GlassCard className="p-6 lg:col-span-2" hover={false}>
          <h3 className="text-sm font-semibold mb-4 text-text-primary flex items-center gap-2">
            <Calendar size={16} className="text-accent" /> Attendance Heatmap (30 Days)
          </h3>
          <div className="grid grid-cols-10 gap-2">
            {Array.from({ length: 30 }).map((_, idx) => {
              const opacities = ['opacity-20', 'opacity-40', 'opacity-60', 'opacity-80', 'opacity-100'];
              const op = opacities[idx % opacities.length];
              return (
                <div key={idx} className={`h-12 bg-emerald-500 rounded-lg flex items-center justify-center text-[10px] font-bold text-black ${op}`} title={`Day ${idx + 1}: 95% attendance`}>
                  {idx + 1}
                </div>
              );
            })}
          </div>
        </GlassCard>

        {/* Leave Requests */}
        <GlassCard className="p-6" hover={false}>
          <h3 className="text-sm font-semibold mb-4 text-text-primary">Pending Leave Requests</h3>
          <div className="space-y-4">
            {leaves.map(req => (
              <div key={req.id} className="bg-surface border border-border p-4 rounded-xl space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-semibold text-text-primary">{req.name}</h4>
                    <span className="text-[10px] text-text-muted">{req.type} ({req.range})</span>
                  </div>
                  {req.status === 'pending' ? (
                    <span className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/25 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase">Pending</span>
                  ) : (
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${req.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25' : 'bg-red-500/10 text-red-400 border border-red-500/25'}`}>
                      {req.status}
                    </span>
                  )}
                </div>

                {req.status === 'pending' && (
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => handleLeaveStatus(req.id, 'rejected')} className="bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white p-1 rounded-lg transition-colors"><X size={14} /></button>
                    <button onClick={() => handleLeaveStatus(req.id, 'approved')} className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white p-1 rounded-lg transition-colors"><Check size={14} /></button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Employee Directory */}
      <GlassCard className="p-6" hover={false}>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h3 className="text-sm font-semibold text-text-primary">Employee Directory</h3>
          <div className="relative w-full max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search directory..."
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              className="w-full bg-surface border border-border rounded-xl py-2 pl-9 pr-4 text-xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredEmployees.map(emp => (
            <div key={emp.id} className="bg-surface border border-border rounded-xl p-4 flex items-center gap-3">
              <Avatar name={emp.name} src={emp.avatar} size={40} />
              <div>
                <h4 className="text-xs font-semibold text-text-primary">{emp.name}</h4>
                <span className="text-[10px] text-text-muted block">{emp.role} • {emp.department}</span>
                <span className={`inline-block mt-2 text-[9px] font-bold px-2 py-0.5 rounded-full ${emp.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                  {emp.status.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
