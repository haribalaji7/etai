import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Loader2, RefreshCw, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { sampleUsers, User } from '@/lib/data';

interface AssignerResult {
  userId: number;
  reasoning: string;
}

export function TaskAssigner() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [result, setResult] = useState<AssignerResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [assigned, setAssigned] = useState(false);

  const handleAnalyze = async () => {
    if (!title || !description) {
      toast.error('Please provide task title and description.');
      return;
    }
    setLoading(true);
    setError(false);
    setResult(null);
    setAssigned(false);

    try {
      const usersContext = sampleUsers.map(u => `{ id: ${u.id}, name: "${u.name}", role: "${u.role}", department: "${u.department}", status: "${u.status}" }`).join('\n');
      const prompt = `Analyze this task and select the BEST team member from the list to assign it to based on their role and department.
      
Task Title: ${title}
Task Description: ${description}

Available Team Members:
${usersContext}

Return ONLY a raw JSON object (no markdown) with exactly these fields:
{
  "userId": 1,
  "reasoning": "brief explanation why they are the best fit"
}`;

      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt, 
          systemPrompt: 'You are an intelligent project management AI.',
          responseFormat: 'json'
        })
      });

      if (!res.ok) throw new Error('API failed');
      const data = await res.json();
      setResult(data);
      toast.success('Analysis complete!');
    } catch (err) {
      console.error(err);
      setError(true);
      toast.error('Failed to analyze task.');
    } finally {
      setLoading(false);
    }
  };

  const selectedUser = result ? sampleUsers.find(u => u.id === result.userId) : null;

  return (
    <div className="glass p-6 rounded-2xl space-y-4">
      <h3 className="text-lg font-bold flex items-center gap-2">
        <Users className="text-accent" /> AI Task Assigner
      </h3>
      <div className="space-y-3">
        <input 
          type="text" 
          placeholder="Task Title (e.g., Optimize database queries)" 
          className="w-full bg-surface border border-border rounded-xl py-2 px-4 text-sm"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <textarea 
          placeholder="Task Description" 
          className="w-full bg-surface border border-border rounded-xl py-2 px-4 text-sm resize-none"
          rows={3}
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        
        <button 
          onClick={handleAnalyze} 
          disabled={loading}
          className="w-full bg-accent hover:bg-accent/90 text-white font-semibold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : 'Find Best Assignee'}
        </button>
      </div>

      {error && (
        <button onClick={handleAnalyze} className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300">
          <RefreshCw size={14} /> Retry Analysis
        </button>
      )}

      {loading && !result && (
        <div className="mt-4 p-4 border border-border rounded-xl bg-surface flex items-center gap-4">
          <div className="w-12 h-12 rounded-full skeleton bg-white/5" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-white/5 rounded skeleton w-1/3"></div>
            <div className="h-3 bg-white/5 rounded skeleton w-2/3"></div>
          </div>
        </div>
      )}

      {result && selectedUser && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-4 p-4 border border-accent/30 bg-accent/5 rounded-xl">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-surface border border-border overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={selectedUser.avatar} alt={selectedUser.name} className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = 'https://ui-avatars.com/api/?name=' + selectedUser.name)} />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-text-primary">{selectedUser.name}</h4>
                <p className="text-xs text-text-muted">{selectedUser.role} • {selectedUser.department}</p>
              </div>
            </div>
            {assigned ? (
              <div className="flex items-center gap-1 text-emerald-400 text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <CheckCircle2 size={14} /> Assigned
              </div>
            ) : (
              <button 
                onClick={() => { setAssigned(true); toast.success('Task assigned!'); }}
                className="bg-accent hover:bg-accent/90 text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors"
              >
                Assign Task
              </button>
            )}
          </div>
          
          <div className="mt-4 relative group">
            <p className="text-xs text-text-muted italic bg-black/20 p-3 rounded-lg border border-border">
              <span className="font-semibold text-accent not-italic">AI Reasoning: </span>
              {result.reasoning}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
