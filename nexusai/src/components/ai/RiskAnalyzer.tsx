import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Loader2, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

interface RiskItem {
  title: string;
  likelihood: 'High' | 'Medium' | 'Low';
  impact: 'High' | 'Medium' | 'Low';
  mitigation: string;
}

interface RiskResult {
  risks: RiskItem[];
}

export function RiskAnalyzer() {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [teamSize, setTeamSize] = useState('');
  
  const [result, setResult] = useState<RiskResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleAnalyze = async () => {
    if (!projectName || !description) {
      toast.error('Please provide project name and description.');
      return;
    }
    setLoading(true);
    setError(false);
    setResult(null);

    try {
      const prompt = `Perform a risk analysis for this project:
Project: ${projectName}
Description: ${description}
Deadline: ${deadline || 'Unknown'}
Team Size: ${teamSize || 'Unknown'}

Identify the 5 most critical risks.
Return ONLY a raw JSON object (no markdown) with this exact structure:
{
  "risks": [
    {
      "title": "Risk name",
      "likelihood": "High", // or Medium, or Low
      "impact": "Medium", // or High, or Low
      "mitigation": "Brief mitigation strategy"
    }
  ]
}`;

      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt, 
          systemPrompt: 'You are an expert project risk analyst.',
          responseFormat: 'json'
        })
      });

      if (!res.ok) throw new Error('API failed');
      const data = await res.json();
      setResult(data);
      toast.success('Risk analysis complete!');
    } catch (err) {
      console.error(err);
      setError(true);
      toast.error('Failed to analyze risks.');
    } finally {
      setLoading(false);
    }
  };

  const getBadgeColor = (level: string) => {
    if (level === 'High') return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
    if (level === 'Medium') return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
  };

  return (
    <div className="glass p-6 rounded-2xl space-y-4">
      <h3 className="text-lg font-bold flex items-center gap-2">
        <AlertTriangle className="text-rose-400" /> AI Risk Analyzer
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input 
          type="text" 
          placeholder="Project Name" 
          className="w-full bg-surface border border-border rounded-xl py-2 px-4 text-sm col-span-1 sm:col-span-2"
          value={projectName}
          onChange={e => setProjectName(e.target.value)}
        />
        <textarea 
          placeholder="Project Description" 
          className="w-full bg-surface border border-border rounded-xl py-2 px-4 text-sm resize-none col-span-1 sm:col-span-2"
          rows={2}
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <input 
          type="text" 
          placeholder="Deadline (e.g., Q3 2024)" 
          className="w-full bg-surface border border-border rounded-xl py-2 px-4 text-sm"
          value={deadline}
          onChange={e => setDeadline(e.target.value)}
        />
        <input 
          type="text" 
          placeholder="Team Size (e.g., 5 developers)" 
          className="w-full bg-surface border border-border rounded-xl py-2 px-4 text-sm"
          value={teamSize}
          onChange={e => setTeamSize(e.target.value)}
        />
      </div>

      <button 
        onClick={handleAnalyze} 
        disabled={loading}
        className="w-full bg-accent hover:bg-accent/90 text-white font-semibold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
      >
        {loading ? <Loader2 className="animate-spin" size={16} /> : 'Generate Risk Matrix'}
      </button>

      {error && (
        <button onClick={handleAnalyze} className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300">
          <RefreshCw size={14} /> Retry Analysis
        </button>
      )}

      {loading && !result && (
        <div className="mt-4 border border-border rounded-xl overflow-hidden bg-surface">
          <div className="p-3 border-b border-border bg-black/20 flex gap-4">
             <div className="h-4 bg-white/5 rounded skeleton w-1/3"></div>
          </div>
          {[1,2,3].map(i => (
            <div key={i} className="p-3 border-b border-border space-y-2">
              <div className="h-3 bg-white/5 rounded skeleton w-full"></div>
              <div className="h-3 bg-white/5 rounded skeleton w-2/3"></div>
            </div>
          ))}
        </div>
      )}

      {result && result.risks && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-black/20 text-text-muted text-xs">
                <th className="p-3 font-medium">Risk Title</th>
                <th className="p-3 font-medium">Likelihood</th>
                <th className="p-3 font-medium">Impact</th>
                <th className="p-3 font-medium">Mitigation</th>
              </tr>
            </thead>
            <tbody>
              {result.risks.map((risk, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-white/5 transition-colors">
                  <td className="p-3 font-medium">{risk.title}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold border ${getBadgeColor(risk.likelihood)}`}>
                      {risk.likelihood}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold border ${getBadgeColor(risk.impact)}`}>
                      {risk.impact}
                    </span>
                  </td>
                  <td className="p-3 text-xs text-text-muted">{risk.mitigation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </div>
  );
}
