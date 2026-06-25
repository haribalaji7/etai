import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, ArrowRight, TrendingUp, AlertCircle, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

interface Suggestion {
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  action: string;
}

export function SmartSuggestions() {
  const [suggestions, setSuggestions] = useState<Suggestion[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const mockMetrics = JSON.stringify({
          revenueGrowth: '+24%',
          churnRate: '1.2%',
          activeIssues: 5,
          serverLoad: '85%',
          openTasks: 12
        });

        const prompt = `Based on this enterprise data: ${mockMetrics}, give 3 actionable suggestions for the manager.
        
Return ONLY a raw JSON array (no markdown, just the array brackets) with objects containing exactly these fields:
[
  {
    "title": "Suggestion Title",
    "description": "Brief explanation",
    "priority": "High", // or Medium, Low
    "action": "Button text (e.g., View Report)"
  }
]`;

        const res = await fetch('/api/ai/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            prompt, 
            systemPrompt: 'You are an executive AI assistant providing daily insights.',
            responseFormat: 'json'
          })
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          const errMsg = errData.error || 'API failed';
          throw new Error(errMsg);
        }
        const data = await res.json();

        const parsed = Array.isArray(data) ? data : (data.suggestions || data.results || []);
        setSuggestions(parsed.slice(0, 3));
      } catch (err) {
        console.error(err);
        toast.error(err instanceof Error ? err.message : 'Failed to load smart suggestions.');
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  const getPriorityIcon = (priority: string) => {
    if (priority === 'High') return <AlertCircle size={16} className="text-rose-400" />;
    if (priority === 'Medium') return <TrendingUp size={16} className="text-amber-400" />;
    return <ShieldCheck size={16} className="text-emerald-400" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2 px-2">
        <Lightbulb className="text-accent" size={18} />
        <h3 className="font-bold text-sm">AI Insights</h3>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass p-4 rounded-xl border border-border space-y-2">
              <div className="flex justify-between">
                <div className="h-4 bg-white/5 rounded skeleton w-1/2"></div>
                <div className="h-4 bg-white/5 rounded skeleton w-12"></div>
              </div>
              <div className="h-3 bg-white/5 rounded skeleton w-full"></div>
              <div className="h-3 bg-white/5 rounded skeleton w-3/4"></div>
              <div className="h-8 bg-white/5 rounded skeleton w-full mt-2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {suggestions?.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass p-4 rounded-xl border border-border hover:border-accent/30 transition-colors group"
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-sm pr-2 text-text-primary">{item.title}</h4>
                <div className="flex-shrink-0 bg-black/20 p-1 rounded-md" title={`Priority: ${item.priority}`}>
                  {getPriorityIcon(item.priority)}
                </div>
              </div>
              <p className="text-xs text-text-muted mb-4 line-clamp-2">{item.description}</p>
              
              <button className="w-full bg-white/5 hover:bg-white/10 text-xs font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition-colors border border-border">
                {item.action} <ArrowRight size={14} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
