'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';
import { GlassCard, RippleButton } from '@/components/ui/shared';
import { FilePlus2, Check, RefreshCw } from 'lucide-react';

const budgetData = [
  { name: 'Engineering', budget: 120000, spent: 95000 },
  { name: 'Marketing', budget: 80000, spent: 78000 },
  { name: 'Operations', budget: 60000, spent: 48000 },
  { name: 'Sales', budget: 90000, spent: 82000 },
];

interface Expense {
  id: string;
  item: string;
  category: string;
  amount: number;
  date: string;
  status: 'cleared' | 'pending';
}

export default function FinancePage() {
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: '1', item: 'AWS Cloud Hosting', category: 'Infrastructure', amount: 4800, date: '2024-12-05', status: 'cleared' },
    { id: '2', item: 'Figma Subscription', category: 'Design Software', amount: 450, date: '2024-12-08', status: 'cleared' },
    { id: '3', item: 'Vercel Pro Team', category: 'Infrastructure', amount: 200, date: '2024-12-11', status: 'pending' },
  ]);

  // Invoice generator state
  const [invoiceTo, setInvoiceTo] = useState('TechNova Labs');
  const [invoiceAmount, setInvoiceAmount] = useState(1450);
  const [invoiceItems, setInvoiceItems] = useState('AI Orchestration Setup Service');

  const generateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    toast.promise(
      new Promise(r => setTimeout(r, 1200)),
      {
        loading: 'Compiling invoice template...',
        success: 'Invoice generated and dispatched!',
        error: 'Generation failed',
      }
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="border-b border-border pb-4">
        <h2 className="text-xl font-bold text-text-primary">Finance & Budget</h2>
        <p className="text-xs text-text-muted">Track department spending, reconcile cloud costs, and issue customer invoices.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* budget chart */}
        <GlassCard className="p-6 lg:col-span-2" hover={false}>
          <h3 className="text-sm font-semibold mb-4 text-text-primary">Department Budget Allocation</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <BarChart data={budgetData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={10} />
                <YAxis stroke="var(--text-muted)" fontSize={10} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }} />
                <Bar dataKey="budget" fill="rgba(124, 58, 237, 0.4)" stroke="var(--accent)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="spent" fill="rgba(6, 182, 212, 0.5)" stroke="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Invoice Generator */}
        <GlassCard className="p-6" hover={false}>
          <h3 className="text-sm font-semibold mb-4 text-text-primary">Invoice Generator</h3>
          <form onSubmit={generateInvoice} className="space-y-4">
            <div>
              <label className="text-xs text-text-muted mb-1 block">Billed To</label>
              <input type="text" value={invoiceTo} onChange={e => setInvoiceTo(e.target.value)} className="w-full bg-base border border-border rounded-xl px-3 py-2 text-xs" required />
            </div>
            <div>
              <label className="text-xs text-text-muted mb-1 block">Amount ($)</label>
              <input type="number" value={invoiceAmount} onChange={e => setInvoiceAmount(Number(e.target.value))} className="w-full bg-base border border-border rounded-xl px-3 py-2 text-xs" required />
            </div>
            <div>
              <label className="text-xs text-text-muted mb-1 block">Line Description</label>
              <textarea value={invoiceItems} onChange={e => setInvoiceItems(e.target.value)} className="w-full bg-base border border-border rounded-xl px-3 py-2 text-xs" rows={2} required />
            </div>
            <button type="submit" className="w-full bg-accent hover:bg-accent/90 text-white py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5">
              <FilePlus2 size={14} /> Send Invoice
            </button>
          </form>
        </GlassCard>
      </div>

      {/* Expense Reconciliation table */}
      <GlassCard className="p-6" hover={false}>
        <h3 className="text-sm font-semibold mb-4 text-text-primary">Expense Reconciliation</h3>
        <div className="border border-border rounded-xl overflow-hidden bg-surface">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="border-b border-border bg-card text-text-muted font-semibold text-left">
                <th className="p-3">Expense Item</th>
                <th className="p-3">Category</th>
                <th className="p-3 text-right">Amount</th>
                <th className="p-3">Date</th>
                <th className="p-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {expenses.map(exp => (
                <tr key={exp.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-3 font-medium text-text-primary">{exp.item}</td>
                  <td className="p-3 text-text-muted">{exp.category}</td>
                  <td className="p-3 text-right font-bold text-text-primary">${exp.amount.toLocaleString()}</td>
                  <td className="p-3 text-text-muted">{exp.date}</td>
                  <td className="p-3 text-right">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${exp.status === 'cleared' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'}`}>
                      {exp.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
