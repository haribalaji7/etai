'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { faqItems } from '@/lib/data';
import { GlassCard, RippleButton } from '@/components/ui/shared';
import { Search, Send, MessageCircle, HelpCircle } from 'lucide-react';

export default function HelpPage() {
  const [searchVal, setSearchVal] = useState('');
  const [selectedFaq, setSelectedFaq] = useState<number | null>(null);
  const [contactSubject, setContactSubject] = useState('');
  const [contactMsg, setContactMsg] = useState('');

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.promise(
      new Promise(r => setTimeout(r, 1200)),
      {
        loading: 'Submitting ticket to support team...',
        success: 'Support ticket submitted successfully!',
        error: 'Submission failed',
      }
    );
    setContactSubject('');
    setContactMsg('');
  };

  const filteredFaqs = faqItems.filter(faq =>
    faq.q.toLowerCase().includes(searchVal.toLowerCase()) ||
    faq.a.toLowerCase().includes(searchVal.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="border-b border-border pb-4">
        <h2 className="text-xl font-bold text-text-primary">Help & Documentation</h2>
        <p className="text-xs text-text-muted">Find answers to frequently asked questions or open a ticket with support.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FAQ list search */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search help articles..."
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              className="w-full bg-surface border border-border rounded-xl py-2 pl-9 pr-4 text-xs"
            />
          </div>

          <div className="space-y-3">
            {filteredFaqs.map((faq, idx) => (
              <div key={idx} className="glass overflow-hidden border border-border/50">
                <button
                  onClick={() => setSelectedFaq(selectedFaq === idx ? null : idx)}
                  className="w-full text-left p-4 font-semibold text-xs text-text-primary flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <span>{faq.q}</span>
                  <HelpCircle size={14} className="text-text-muted flex-shrink-0 ml-2" />
                </button>
                {selectedFaq === idx && (
                  <p className="px-4 pb-4 text-xs text-text-muted leading-relaxed border-t border-border/10 pt-2 bg-white/5">{faq.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <GlassCard className="p-6 h-fit" hover={false}>
          <h3 className="text-sm font-semibold mb-4 text-text-primary flex items-center gap-1.5">
            <MessageCircle size={16} className="text-accent" /> Contact Support
          </h3>
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-text-muted mb-1 block">Subject</label>
              <input type="text" value={contactSubject} onChange={e => setContactSubject(e.target.value)} className="w-full bg-base border border-border rounded-xl px-3 py-2 text-xs" required />
            </div>
            <div>
              <label className="text-xs text-text-muted mb-1 block">Message details</label>
              <textarea value={contactMsg} onChange={e => setContactMsg(e.target.value)} className="w-full bg-base border border-border rounded-xl px-3 py-2 text-xs" rows={4} required />
            </div>
            <button type="submit" className="w-full bg-accent hover:bg-accent/90 text-white py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5">
              <Send size={14} /> Submit Ticket
            </button>
          </form>
        </GlassCard>
      </div>
    </div>
  );
}
