'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { GlassCard, RippleButton } from '@/components/ui/shared';
import { ChevronLeft, ChevronRight, Plus, X, Calendar as CalendarIcon, Clock, User } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  invitee: string;
  color: string;
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 11, 23)); // Dec 2024
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [events, setEvents] = useState<Event[]>([
    { id: '1', title: 'System Architecture Review', date: '2024-12-10', time: '10:00 AM', invitee: 'Sarah Chen', color: 'bg-purple-500' },
    { id: '2', title: 'Marketing Campaign Launch', date: '2024-12-15', time: '02:00 PM', invitee: 'Marcus Williams', color: 'bg-blue-500' },
    { id: '3', title: 'Q4 Budget Review Meeting', date: '2024-12-23', time: '11:00 AM', invitee: 'Priya Patel', color: 'bg-emerald-500' },
  ]);

  // Event modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('2024-12-23');
  const [newTime, setNewTime] = useState('10:00 AM');
  const [newInvitee, setNewInvitee] = useState('Sarah Chen');

  const addEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newEv: Event = {
      id: Math.random().toString(),
      title: newTitle,
      date: newDate,
      time: newTime,
      invitee: newInvitee,
      color: ['bg-purple-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500'][Math.floor(Math.random() * 4)],
    };

    setEvents(prev => [...prev, newEv]);
    setShowAddModal(false);
    setNewTitle('');
    toast.success('Event scheduled successfully');
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(ev => ev.id !== id));
    toast.success('Event deleted');
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const startDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div className="p-6 space-y-6">
      {/* Action Bar */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-bold text-text-primary">Workspace Calendar</h2>
          <p className="text-xs text-text-muted">Schedule business events and track autonomous task timelines.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-surface p-1 rounded-xl border border-border text-xs">
            {(['month', 'week', 'day'] as const).map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all capitalize ${view === v ? 'bg-accent text-white' : 'text-text-muted hover:text-text-primary'}`}
              >
                {v}
              </button>
            ))}
          </div>
          <button onClick={() => setShowAddModal(true)} className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5">
            <Plus size={14} /> Schedule Event
          </button>
        </div>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
          <CalendarIcon size={18} className="text-accent" />
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="glass !bg-white/5 hover:!bg-white/10 p-2 !rounded-xl text-text-muted hover:text-text-primary"><ChevronLeft size={16} /></button>
          <button onClick={nextMonth} className="glass !bg-white/5 hover:!bg-white/10 p-2 !rounded-xl text-text-muted hover:text-text-primary"><ChevronRight size={16} /></button>
        </div>
      </div>

      {/* Month View Grid */}
      {view === 'month' && (
        <GlassCard className="p-6" hover={false}>
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-text-muted border-b border-border pb-4 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <span key={d}>{d}</span>)}
          </div>
          <div className="grid grid-cols-7 gap-3 min-h-[420px]">
            {/* Blank padding days */}
            {Array.from({ length: startDayOfMonth }).map((_, idx) => (
              <div key={`empty-${idx}`} className="bg-surface/20 rounded-xl border border-transparent" />
            ))}

            {/* Days in Month */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const dateStr = `2024-12-${String(dayNum).padStart(2, '0')}`;
              const dayEvents = events.filter(ev => ev.date === dateStr);

              return (
                <div key={dayNum} className="bg-surface border border-border rounded-xl p-3 flex flex-col justify-between hover:border-accent/40 transition-colors min-h-[70px]">
                  <span className="text-[10px] text-text-muted font-bold">{dayNum}</span>
                  <div className="space-y-1 mt-2">
                    {dayEvents.map(ev => (
                      <div
                        key={ev.id}
                        className={`text-[8px] font-bold text-white px-1.5 py-0.5 rounded truncate flex items-center justify-between group cursor-pointer ${ev.color}`}
                      >
                        <span className="truncate">{ev.title}</span>
                        <button onClick={(e) => { e.stopPropagation(); deleteEvent(ev.id); }} className="opacity-0 group-hover:opacity-100 text-white ml-1">×</button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>
      )}

      {/* Week / Day Fallback placeholder */}
      {view !== 'month' && (
        <GlassCard className="p-12 text-center text-text-muted" hover={false}>
          <CalendarIcon size={40} className="mx-auto mb-3 opacity-30" />
          <h4 className="font-semibold text-text-primary text-sm mb-1">{view.toUpperCase()} view is active</h4>
          <p className="text-xs max-w-sm mx-auto">This calendar shows events for the scheduled range. Switch to Month View to add and preview full dates.</p>
        </GlassCard>
      )}

      {/* EVENT ADD MODAL */}
      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddModal(false)} />
            <motion.div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-surface border border-border rounded-2xl z-50 p-6" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
              <div className="flex justify-between items-center border-b border-border pb-4 mb-6">
                <h3 className="font-semibold text-sm">Schedule New Event</h3>
                <button onClick={() => setShowAddModal(false)} className="text-text-muted hover:text-text-primary"><X size={18} /></button>
              </div>

              <form onSubmit={addEvent} className="space-y-4">
                <div>
                  <label className="text-xs text-text-muted mb-1 block">Title</label>
                  <input type="text" placeholder="Meeting name" value={newTitle} onChange={e => setNewTitle(e.target.value)} className="w-full bg-base border border-border rounded-xl px-3 py-2 text-xs" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-text-muted mb-1 block">Date</label>
                    <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} className="w-full bg-base border border-border rounded-xl px-3 py-2 text-xs" required />
                  </div>
                  <div>
                    <label className="text-xs text-text-muted mb-1 block">Time</label>
                    <input type="text" value={newTime} onChange={e => setNewTime(e.target.value)} className="w-full bg-base border border-border rounded-xl px-3 py-2 text-xs" required />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-text-muted mb-1 block">Invitee</label>
                  <input type="text" value={newInvitee} onChange={e => setNewInvitee(e.target.value)} className="w-full bg-base border border-border rounded-xl px-3 py-2 text-xs" required />
                </div>
                <button type="submit" className="w-full bg-accent hover:bg-accent/90 text-white py-2 rounded-xl text-xs font-semibold">Create Event</button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
