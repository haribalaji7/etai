'use client';

import { useState } from 'react';
import { GlassCard, Avatar } from '@/components/ui/shared';
import { Mail, Briefcase, MapPin, Calendar } from 'lucide-react';

export default function ProfilePage() {
  const [activity] = useState(() => Array.from({ length: 90 })); // 90 days activity data

  return (
    <div className="p-6 space-y-6">
      {/* Cover Header */}
      <div className="relative rounded-2xl overflow-hidden h-48 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 flex items-end p-6">
        <div className="absolute inset-0 bg-black/20" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-20 h-20 rounded-full border-4 border-surface overflow-hidden bg-accent/20 flex items-center justify-center text-accent font-bold text-2xl">
            SC
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Sarah Chen</h2>
            <span className="text-xs text-white/80 block">Product Manager • Engineering</span>
          </div>
        </div>
      </div>

      {/* Metadata Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-4 space-y-3" hover={false}>
          <h3 className="text-xs font-semibold text-text-primary">Contact Coordinates</h3>
          <div className="space-y-2 text-xs text-text-muted">
            <div className="flex items-center gap-2"><Mail size={14} /> sarah@nexusai.com</div>
            <div className="flex items-center gap-2"><Briefcase size={14} /> Engineering Department</div>
            <div className="flex items-center gap-2"><MapPin size={14} /> San Francisco, CA</div>
          </div>
        </GlassCard>

        <GlassCard className="p-4 space-y-3" hover={false}>
          <h3 className="text-xs font-semibold text-text-primary">Workspace Statistics</h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-text-muted block">Workflows Triggered</span>
              <span className="font-bold text-text-primary text-base">142</span>
            </div>
            <div>
              <span className="text-text-muted block">Tasks completed</span>
              <span className="font-bold text-text-primary text-base">1,124</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4 space-y-3" hover={false}>
          <h3 className="text-xs font-semibold text-text-primary">System Role Coordinates</h3>
          <div className="space-y-2 text-xs text-text-muted">
            <div>Admin clearance: <span className="text-accent font-semibold">Tier 3 (Super Admin)</span></div>
            <div>Registered since: <span className="text-text-primary font-semibold">June 2024</span></div>
          </div>
        </GlassCard>
      </div>

      {/* Activity Heatmap */}
      <GlassCard className="p-6" hover={false}>
        <h3 className="text-sm font-semibold mb-4 text-text-primary flex items-center gap-2">
          <Calendar size={16} className="text-accent" /> Work Activity Heatmap (90 Days)
        </h3>
        <div className="grid grid-cols-15 gap-1.5 max-w-4xl">
          {activity.map((_, idx) => {
            const colors = ['bg-zinc-800', 'bg-emerald-950', 'bg-emerald-800', 'bg-emerald-600', 'bg-emerald-400'];
            const color = colors[idx % colors.length];
            return (
              <div key={idx} className={`h-4 w-4 rounded-sm ${color}`} title={`Day ${idx + 1}: ${idx % 5} tasks executed`} />
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
}
