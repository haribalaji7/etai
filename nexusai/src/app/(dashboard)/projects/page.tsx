'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, useSensor, useSensors, PointerSensor, KeyboardSensor, DragEndEvent } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import toast from 'react-hot-toast';
import { sampleUsers, kanbanTasks, KanbanTask, User } from '@/lib/data';
import { Avatar, GlassCard, RippleButton } from '@/components/ui/shared';
import { Calendar as CalendarIcon, List as ListIcon, Kanban as KanbanIcon, BarChart2, Plus, X, Paperclip, MessageSquare } from 'lucide-react';

const columns = [
  { id: 'backlog', title: 'Backlog', color: 'bg-zinc-500/20 text-zinc-400' },
  { id: 'todo', title: 'Todo', color: 'bg-blue-500/20 text-blue-400' },
  { id: 'in-progress', title: 'In Progress', color: 'bg-yellow-500/20 text-yellow-400' },
  { id: 'review', title: 'Review', color: 'bg-purple-500/20 text-purple-400' },
  { id: 'done', title: 'Done', color: 'bg-emerald-500/20 text-emerald-400' },
];

export default function ProjectsPage() {
  const [activeTab, setActiveTab] = useState<'kanban' | 'gantt' | 'calendar' | 'list'>('kanban');
  const [tasks, setTasks] = useState<KanbanTask[]>(() => kanbanTasks);
  const [selectedTask, setSelectedTask] = useState<KanbanTask | null>(null);

  // Kanban Add Task states
  const [addTaskCol, setAddTaskCol] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const overCol = over.id as KanbanTask['status'];

    // Move to next column
    if (columns.some(col => col.id === overCol)) {
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: overCol } : t));
      toast.success(`Task moved to ${overCol.toUpperCase()}`);
    }
  };

  const handleAddTask = (status: KanbanTask['status']) => {
    if (!newTitle.trim()) return;
    const newTask: KanbanTask = {
      id: Math.random().toString(),
      title: newTitle,
      description: 'Double click to add detailed description.',
      status,
      priority: 'medium',
      assignee: sampleUsers[0],
      dueDate: new Date().toISOString().split('T')[0],
      tags: ['task'],
    };
    setTasks(prev => [...prev, newTask]);
    setNewTitle('');
    setAddTaskCol(null);
    toast.success('Task created');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header Tabs */}
      <div className="flex items-center justify-between border-b border-border pb-4 flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-text-primary">Project Management</h2>
          <p className="text-xs text-text-muted">Manage tasks, timelines, calendar events, and team logs.</p>
        </div>
        <div className="flex bg-surface p-1.5 rounded-xl border border-border">
          {[
            { id: 'kanban', label: 'Kanban', icon: KanbanIcon },
            { id: 'gantt', label: 'Gantt Chart', icon: BarChart2 },
            { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
            { id: 'list', label: 'List View', icon: ListIcon },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === tab.id ? 'bg-accent text-white' : 'text-text-muted hover:text-text-primary'}`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main View Area */}
      <div className="min-h-[500px]">
        {activeTab === 'kanban' && (
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {columns.map(col => {
                const colTasks = tasks.filter(t => t.status === col.id);
                return (
                  <div key={col.id} className="flex flex-col bg-surface border border-border rounded-2xl p-4 min-h-[400px]">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${col.color}`}>
                        {col.title}
                      </span>
                      <span className="text-xs font-semibold text-text-muted">{colTasks.length}</span>
                    </div>

                    <div className="flex-1 space-y-3 overflow-y-auto max-h-[500px] mb-3">
                      {colTasks.map(task => (
                        <motion.div
                          key={task.id}
                          layoutId={task.id}
                          className="glass p-4 cursor-pointer hover:glow-border select-none"
                          onClick={() => setSelectedTask(task)}
                          whileHover={{ scale: 1.03 }}
                        >
                          <h4 className="text-xs font-semibold text-text-primary mb-2 line-clamp-2">{task.title}</h4>
                          <div className="flex items-center justify-between mt-4">
                            <span className={`w-2.5 h-2.5 rounded-full ${task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                            <Avatar name={task.assignee.name} src={task.assignee.avatar} size={24} />
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Inline Task Form */}
                    {addTaskCol === col.id ? (
                      <div className="space-y-2">
                        <textarea
                          placeholder="Task title..."
                          value={newTitle}
                          onChange={e => setNewTitle(e.target.value)}
                          className="w-full bg-base border border-border rounded-xl p-2 text-xs outline-none"
                          rows={2}
                        />
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => setAddTaskCol(null)} className="text-xs text-text-muted hover:text-text-primary px-2 py-1">Cancel</button>
                          <button onClick={() => handleAddTask(col.id as any)} className="bg-accent text-white px-3 py-1 rounded-lg text-xs font-semibold">Add</button>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => setAddTaskCol(col.id)} className="flex items-center justify-center gap-1 w-full border border-dashed border-border hover:border-accent/40 rounded-xl py-2 text-xs text-text-muted hover:text-text-primary transition-colors">
                        <Plus size={14} /> Add Task
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </DndContext>
        )}

        {activeTab === 'gantt' && (
          <GlassCard className="p-6 overflow-x-auto" hover={false}>
            <div className="min-w-[800px]">
              {/* Gantt SVG rendering */}
              <div className="grid grid-cols-12 border-b border-border pb-4 mb-4 text-xs font-semibold text-text-muted">
                <div className="col-span-3">Task Name</div>
                <div className="col-span-9 flex justify-between px-6">
                  {['Week 1', 'Week 2', 'Week 3', 'Week 4'].map((w, idx) => <span key={idx}>{w}</span>)}
                </div>
              </div>

              <div className="space-y-4 relative">
                {/* Red Today indicator vertical line */}
                <div className="absolute left-[35%] top-0 bottom-0 w-0.5 bg-red-500 z-10" />

                {tasks.map((task, index) => {
                  // calculate position based on indices for simplicity of custom SVG Gantt
                  const offset = 20 + (index * 6) % 40;
                  const width = 25 + (index * 4) % 35;
                  const colors = ['#7c3aed', '#3b82f6', '#10b981', '#f59e0b', '#ec4899'];
                  const barColor = colors[index % colors.length];

                  return (
                    <div key={task.id} className="grid grid-cols-12 items-center text-xs">
                      <div className="col-span-3 font-medium text-text-primary truncate">{task.title}</div>
                      <div className="col-span-9 relative h-8 bg-surface border border-border rounded-lg overflow-hidden flex items-center">
                        <div
                          className="h-full rounded-md flex items-center px-3 text-[10px] font-bold text-white shadow-lg cursor-pointer hover:brightness-110"
                          style={{
                            width: `${width}%`,
                            marginLeft: `${offset}%`,
                            backgroundColor: barColor,
                          }}
                          onClick={() => setSelectedTask(task)}
                        >
                          {task.assignee.name}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </GlassCard>
        )}

        {activeTab === 'calendar' && (
          <GlassCard className="p-6" hover={false}>
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-text-muted border-b border-border pb-4 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <span key={d}>{d}</span>)}
            </div>
            <div className="grid grid-cols-7 gap-2 min-h-[400px]">
              {Array.from({ length: 35 }).map((_, idx) => {
                const dayNum = (idx % 31) + 1;
                // mock tasks matching days
                const dayTasks = tasks.filter((_, tIdx) => (tIdx * 3) % 31 === dayNum - 1);
                return (
                  <div key={idx} className="bg-surface border border-border rounded-xl p-2 flex flex-col justify-between hover:border-accent/40 transition-colors">
                    <span className="text-[10px] text-text-muted font-bold">{dayNum}</span>
                    <div className="space-y-1">
                      {dayTasks.map(t => (
                        <div key={t.id} onClick={() => setSelectedTask(t)} className="bg-accent/10 border border-accent/20 rounded-md p-1 text-[8px] font-bold text-accent truncate cursor-pointer">
                          {t.title}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        )}

        {activeTab === 'list' && (
          <GlassCard className="p-6" hover={false}>
            <div className="border border-border rounded-xl overflow-hidden bg-surface">
              <div className="grid grid-cols-12 gap-4 p-4 border-b border-border bg-card text-xs font-semibold text-text-muted">
                <span className="col-span-5">Task Name</span>
                <span className="col-span-2">Status</span>
                <span className="col-span-2">Priority</span>
                <span className="col-span-3 text-right">Assignee</span>
              </div>
              <div className="divide-y divide-border/50">
                {tasks.map(task => (
                  <div
                    key={task.id}
                    onClick={() => setSelectedTask(task)}
                    className="grid grid-cols-12 gap-4 px-4 py-3.5 items-center hover:bg-white/5 cursor-pointer text-xs transition-colors"
                  >
                    <span className="col-span-5 font-medium text-text-primary truncate">{task.title}</span>
                    <span className="col-span-2 capitalize text-text-muted">{task.status}</span>
                    <span className="col-span-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${task.priority === 'high' ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                        {task.priority}
                      </span>
                    </span>
                    <div className="col-span-3 flex justify-end">
                      <Avatar name={task.assignee.name} src={task.assignee.avatar} size={24} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        )}
      </div>

      {/* DETAIL MODAL */}
      <AnimatePresence>
        {selectedTask && (
          <>
            <motion.div className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedTask(null)} />
            <motion.div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-surface border border-border rounded-2xl z-50 p-6" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
              <div className="flex justify-between items-start border-b border-border pb-4 mb-6">
                <div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${selectedTask.priority === 'high' ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                    {selectedTask.priority}
                  </span>
                  <h3 className="font-semibold text-base mt-2 text-text-primary">{selectedTask.title}</h3>
                </div>
                <button onClick={() => setSelectedTask(null)} className="text-text-muted hover:text-text-primary"><X size={18} /></button>
              </div>

              <div className="space-y-4 text-xs text-text-muted leading-relaxed">
                <div>
                  <h4 className="font-bold text-text-primary mb-1">Description</h4>
                  <p>{selectedTask.description}</p>
                </div>

                <div className="flex items-center justify-between border-t border-border pt-4">
                  <div>
                    <h4 className="font-bold text-text-primary mb-1">Assignee</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Avatar name={selectedTask.assignee.name} src={selectedTask.assignee.avatar} size={28} />
                      <span className="font-semibold text-text-primary">{selectedTask.assignee.name}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-text-primary mb-1">Due Date</h4>
                    <span className="font-semibold text-text-primary">{selectedTask.dueDate}</span>
                  </div>
                </div>

                <div className="border-t border-border pt-4 space-y-3">
                  <h4 className="font-bold text-text-primary">Discussion</h4>
                  <div className="flex gap-2">
                    <Avatar name={sampleUsers[0].name} src={sampleUsers[0].avatar} size={24} />
                    <input placeholder="Add comment..." className="flex-1 bg-base border border-border rounded-xl px-3 py-1.5 text-xs outline-none" />
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
