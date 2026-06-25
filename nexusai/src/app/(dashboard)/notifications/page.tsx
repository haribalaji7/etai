'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { GlassCard, RippleButton } from '@/components/ui/shared';
import { Bell, CheckCheck, Trash2, ShieldAlert, Cpu, MessageSquare } from 'lucide-react';

interface Notification {
  id: string;
  type: 'system' | 'workflow' | 'chat';
  title: string;
  desc: string;
  time: string;
  read: boolean;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', type: 'system', title: 'System Security update', desc: 'AWS keys rotated on Dec 20, 2024 at 10:42 PM.', time: '1 hour ago', read: false },
    { id: '2', type: 'workflow', title: 'Lead Qualification AI triggered', desc: 'Process executed successfully in 2.3 seconds.', time: '3 hours ago', read: false },
    { id: '3', type: 'chat', title: 'New message from Strategist', desc: 'Let me look over the business strategy plan once more.', time: 'Yesterday', read: true },
  ]);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.success('Notification deleted');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="border-b border-border pb-4 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-text-primary">System Notifications</h2>
          <p className="text-xs text-text-muted">Track critical events, model conversions, and agent status feeds.</p>
        </div>
        {notifications.some(n => !n.read) && (
          <button onClick={markAllRead} className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5">
            <CheckCheck size={14} /> Mark all read
          </button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.map(notif => {
          const icons = {
            system: ShieldAlert,
            workflow: Cpu,
            chat: MessageSquare,
          };
          const Icon = icons[notif.type];
          return (
            <GlassCard key={notif.id} className={`p-4 flex items-center justify-between border ${notif.read ? 'border-border/50 opacity-70' : 'border-accent/20'}`} hover={false}>
              <div className="flex gap-3">
                <div className={`p-2 rounded-xl mt-1 h-fit ${notif.type === 'system' ? 'bg-red-500/10 text-red-400' : notif.type === 'workflow' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'}`}>
                  <Icon size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-text-primary flex items-center gap-2">
                    {notif.title}
                    {!notif.read && <span className="w-1.5 h-1.5 rounded-full bg-accent" />}
                  </h4>
                  <p className="text-xs text-text-muted mt-1 leading-relaxed">{notif.desc}</p>
                  <span className="text-[10px] text-text-muted mt-2 block">{notif.time}</span>
                </div>
              </div>
              <button onClick={() => deleteNotification(notif.id)} className="text-text-muted hover:text-red-400 p-2 hover:bg-red-500/10 rounded-xl transition-all"><Trash2 size={16} /></button>
            </GlassCard>
          );
        })}

        {notifications.length === 0 && (
          <div className="text-center py-16 text-text-muted">
            <Bell size={40} className="mx-auto mb-2 opacity-35" />
            <p className="text-xs">No active notifications found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
