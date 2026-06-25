'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { GlassCard, RippleButton } from '@/components/ui/shared';
import { Save, Shield, Key, Eye, EyeOff } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'api-keys'>('profile');
  const [showKey, setShowKey] = useState(false);
  const [apiKey, setApiKey] = useState('sk_live_51NzQ...xT98');

  // Form states
  const [name, setName] = useState('Sarah Chen');
  const [email, setEmail] = useState('sarah@nexusai.com');
  const [notifyEmail, setNotifyEmail] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Settings updated successfully');
  };

  const rotateKey = () => {
    setApiKey(`sk_live_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`);
    toast.success('API Key rotated successfully');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="border-b border-border pb-4">
        <h2 className="text-xl font-bold text-text-primary">System Settings</h2>
        <p className="text-xs text-text-muted">Configure profile coordinates, credentials, email alerts, and API credentials.</p>
      </div>

      <div className="flex gap-6 flex-col lg:flex-row">
        {/* Navigation Tabs */}
        <div className="lg:w-1/4 flex lg:flex-col bg-surface border border-border p-2 rounded-xl h-fit gap-1">
          {[
            { id: 'profile', label: 'Profile' },
            { id: 'security', label: 'Security' },
            { id: 'notifications', label: 'Notifications' },
            { id: 'api-keys', label: 'API Keys' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-semibold transition-all ${activeTab === tab.id ? 'bg-accent text-white' : 'text-text-muted hover:text-text-primary'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content panel */}
        <GlassCard className="flex-1 p-6" hover={false}>
          {activeTab === 'profile' && (
            <form onSubmit={handleSave} className="space-y-4 max-w-md">
              <h3 className="text-sm font-semibold text-text-primary mb-4">Edit Profile coordinates</h3>
              <div>
                <label className="text-xs text-text-muted mb-1 block">Full Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-base border border-border rounded-xl px-3 py-2 text-xs" />
              </div>
              <div>
                <label className="text-xs text-text-muted mb-1 block">Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-base border border-border rounded-xl px-3 py-2 text-xs" />
              </div>
              <button type="submit" className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5">
                <Save size={14} /> Save Profile
              </button>
            </form>
          )}

          {activeTab === 'security' && (
            <form onSubmit={handleSave} className="space-y-4 max-w-md">
              <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-1.5">
                <Shield size={16} className="text-accent" /> Password credentials
              </h3>
              <div>
                <label className="text-xs text-text-muted mb-1 block">Current Password</label>
                <input type="password" placeholder="••••••••" className="w-full bg-base border border-border rounded-xl px-3 py-2 text-xs" />
              </div>
              <div>
                <label className="text-xs text-text-muted mb-1 block">New Password</label>
                <input type="password" placeholder="••••••••" className="w-full bg-base border border-border rounded-xl px-3 py-2 text-xs" />
              </div>
              <button type="submit" className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5">
                <Save size={14} /> Update Security
              </button>
            </form>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-4 max-w-md">
              <h3 className="text-sm font-semibold text-text-primary mb-4">Notification Toggles</h3>
              <label className="flex items-center justify-between cursor-pointer py-2 border-b border-border/50">
                <span className="text-xs text-text-primary">Email alerts on system anomaly</span>
                <input type="checkbox" checked={notifyEmail} onChange={e => setNotifyEmail(e.target.checked)} className="rounded bg-base border-border text-accent focus:ring-accent" />
              </label>
              <label className="flex items-center justify-between cursor-pointer py-2 border-b border-border/50">
                <span className="text-xs text-text-primary">Push notifications on workflow failure</span>
                <input type="checkbox" defaultChecked className="rounded bg-base border-border text-accent focus:ring-accent" />
              </label>
            </div>
          )}

          {activeTab === 'api-keys' && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-text-primary flex items-center gap-1.5">
                <Key size={16} className="text-accent" /> API Keys credentials
              </h3>
              <p className="text-xs text-text-muted max-w-md leading-relaxed">Use this API key to trigger webhooks and query NexusAI workflow executions from external systems.</p>
              <div className="flex items-center gap-3 max-w-md mt-4">
                <div className="flex-1 bg-base border border-border rounded-xl px-3 py-2 text-xs font-mono select-all flex items-center justify-between">
                  <span>{showKey ? apiKey : '••••••••••••••••••••••••'}</span>
                  <button onClick={() => setShowKey(!showKey)} className="text-text-muted hover:text-text-primary ml-2">
                    {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                <button onClick={rotateKey} className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-xl text-xs font-semibold">Rotate</button>
              </div>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
