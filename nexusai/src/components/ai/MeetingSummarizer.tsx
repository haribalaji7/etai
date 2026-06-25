import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Loader2, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

interface SummaryResult {
  summary: string[];
  actionItems: string[];
  decisions: string[];
  nextSteps: string[];
}

export function MeetingSummarizer() {
  const [transcript, setTranscript] = useState('');
  const [result, setResult] = useState<SummaryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleSummarize = async () => {
    if (!transcript.trim()) {
      toast.error('Please provide a meeting transcript.');
      return;
    }
    setLoading(true);
    setError(false);
    setResult(null);

    try {
      const prompt = `Analyze this meeting transcript and extract the following:
1. 3-5 bullet points of the overall summary
2. Action items list
3. Decisions made
4. Next steps

Return ONLY a raw JSON object (no markdown formatting) with this exact structure:
{
  "summary": ["point 1", "point 2"],
  "actionItems": ["action 1", "action 2"],
  "decisions": ["decision 1"],
  "nextSteps": ["step 1"]
}

Transcript:
${transcript}`;

      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt, 
          systemPrompt: 'You are an executive assistant AI.',
          responseFormat: 'json'
        })
      });

      if (!res.ok) throw new Error('API failed');
      const data = await res.json();
      setResult(data);
      toast.success('Meeting summarized!');
    } catch (err) {
      console.error(err);
      setError(true);
      toast.error('Failed to summarize meeting.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass p-6 rounded-2xl space-y-4">
      <h3 className="text-lg font-bold flex items-center gap-2">
        <FileText className="text-accent" /> Meeting Summarizer
      </h3>
      <textarea 
        placeholder="Paste meeting transcript here..." 
        className="w-full bg-surface border border-border rounded-xl py-3 px-4 text-sm resize-y min-h-[120px]"
        value={transcript}
        onChange={e => setTranscript(e.target.value)}
      />
      
      <button 
        onClick={handleSummarize} 
        disabled={loading}
        className="w-full bg-accent hover:bg-accent/90 text-white font-semibold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
      >
        {loading ? <Loader2 className="animate-spin" size={16} /> : 'Summarize'}
      </button>

      {error && (
        <button onClick={handleSummarize} className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300">
          <RefreshCw size={14} /> Retry Summary
        </button>
      )}

      {loading && !result && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-surface border border-border p-4 rounded-xl space-y-2">
              <div className="h-4 bg-white/5 rounded skeleton w-1/2"></div>
              <div className="h-3 bg-white/5 rounded skeleton w-full mt-2"></div>
              <div className="h-3 bg-white/5 rounded skeleton w-5/6"></div>
            </div>
          ))}
        </div>
      )}

      {result && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div className="bg-surface border border-border p-4 rounded-xl">
            <h4 className="font-semibold text-sm mb-2 text-blue-400">📝 Summary</h4>
            <ul className="list-disc pl-4 space-y-1 text-xs text-text-muted">
              {result.summary?.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </div>
          <div className="bg-surface border border-border p-4 rounded-xl">
            <h4 className="font-semibold text-sm mb-2 text-rose-400">✅ Action Items</h4>
            <ul className="list-disc pl-4 space-y-1 text-xs text-text-muted">
              {result.actionItems?.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </div>
          <div className="bg-surface border border-border p-4 rounded-xl">
            <h4 className="font-semibold text-sm mb-2 text-emerald-400">⚖️ Decisions</h4>
            <ul className="list-disc pl-4 space-y-1 text-xs text-text-muted">
              {result.decisions?.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </div>
          <div className="bg-surface border border-border p-4 rounded-xl">
            <h4 className="font-semibold text-sm mb-2 text-amber-400">🚀 Next Steps</h4>
            <ul className="list-disc pl-4 space-y-1 text-xs text-text-muted">
              {result.nextSteps?.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </div>
        </motion.div>
      )}
    </div>
  );
}
