'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { GlassCard, Avatar } from '@/components/ui/shared';
import { Search, Flame, ArrowRight, UserCheck, MessageSquare } from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  company: string;
  value: number;
  stage: 'lead' | 'contacted' | 'proposal' | 'won';
  score: number;
}

export default function CRMPage() {
  const [leads, setLeads] = useState<Lead[]>([
    { id: '1', name: 'James Carter', company: 'GlobalTech Solutions', value: 45000, stage: 'proposal', score: 92 },
    { id: '2', name: 'Sophia Lin', company: 'Innovate Corp', value: 28000, stage: 'contacted', score: 78 },
    { id: '3', name: 'Oliver Smith', company: 'Finances.io', value: 85000, stage: 'lead', score: 64 },
    { id: '4', name: 'Emma Watson', company: 'Apex Digital', value: 60000, stage: 'won', score: 98 },
  ]);

  const advanceStage = (id: string) => {
    const stages: Lead['stage'][] = ['lead', 'contacted', 'proposal', 'won'];
    setLeads(prev => prev.map(l => {
      if (l.id === id) {
        const idx = stages.indexOf(l.stage);
        const nextStage = idx < stages.length - 1 ? stages[idx + 1] : l.stage;
        toast.success(`Lead stage advanced to ${nextStage.toUpperCase()}`);
        return { ...l, stage: nextStage };
      }
      return l;
    }));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="border-b border-border pb-4">
        <h2 className="text-xl font-bold text-text-primary">CRM & Leads</h2>
        <p className="text-xs text-text-muted">Accelerate sales with AI lead scoring, client milestones, and stage transitions.</p>
      </div>

      {/* Sales Pipeline columns */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {(['lead', 'contacted', 'proposal', 'won'] as const).map(stage => {
          const stageLeads = leads.filter(l => l.stage === stage);
          const colors = {
            lead: 'border-l-zinc-500',
            contacted: 'border-l-blue-500',
            proposal: 'border-l-yellow-500',
            won: 'border-l-emerald-500',
          };

          return (
            <div key={stage} className="bg-surface border border-border rounded-xl p-4 min-h-[300px] flex flex-col">
              <span className="text-[10px] font-bold uppercase text-text-muted mb-4 block">
                {stage} ({stageLeads.length})
              </span>
              <div className="space-y-3 flex-1">
                {stageLeads.map(lead => (
                  <div key={lead.id} className={`glass p-3 border-l-4 ${colors[lead.stage]} space-y-2`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xs font-semibold text-text-primary">{lead.name}</h4>
                        <span className="text-[9px] text-text-muted">{lead.company}</span>
                      </div>
                      <span className="text-[10px] font-bold text-accent">${(lead.value / 1000).toFixed(0)}K</span>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50 text-[10px]">
                      <span className="flex items-center gap-1 font-semibold text-amber-400">
                        <Flame size={12} /> Score: {lead.score}%
                      </span>
                      {stage !== 'won' && (
                        <button onClick={() => advanceStage(lead.id)} className="text-text-muted hover:text-text-primary transition-colors flex items-center gap-0.5">
                          Advance <ArrowRight size={10} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Contact Timeline / AI Score logic */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6" hover={false}>
          <h3 className="text-sm font-semibold mb-4 text-text-primary">Contact Timeline Feed</h3>
          <div className="space-y-4">
            {[
              { desc: 'Email sent by Writer Agent to James Carter regarding Proposal #8', date: 'Just now', icon: MessageSquare },
              { desc: 'AI Lead scoring re-calculated Oliver Smith probability (Up 15%)', date: '2 hours ago', icon: Flame },
              { desc: 'CRM synced contact coordinates with HubSpot integration', date: 'Yesterday', icon: UserCheck },
            ].map((feed, idx) => (
              <div key={idx} className="flex gap-3 text-xs items-start">
                <div className="p-1.5 bg-accent/10 border border-accent/20 rounded-lg text-accent mt-0.5"><feed.icon size={14} /></div>
                <div>
                  <p className="font-medium text-text-primary">{feed.desc}</p>
                  <span className="text-[10px] text-text-muted">{feed.date}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6" hover={false}>
          <h3 className="text-sm font-semibold mb-4 text-text-primary">Lead Score Analytics</h3>
          <div className="space-y-4 text-xs text-text-muted leading-relaxed">
            <p>Our autonomous neural algorithm analyzes lead variables (domain reputation, document views, email click depth) to grade customer value index.</p>
            <div className="h-2 bg-surface rounded-full overflow-hidden">
              <div className="h-full bg-accent rounded-full" style={{ width: '82%' }} />
            </div>
            <div className="flex justify-between text-[10px] font-semibold text-text-muted">
              <span>Low Value</span>
              <span>Average: 82% Conversion probability</span>
              <span>High Value</span>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
