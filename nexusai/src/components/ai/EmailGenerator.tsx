import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Copy, Loader2, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export function EmailGenerator() {
  const [recipient, setRecipient] = useState('');
  const [purpose, setPurpose] = useState('');
  const [tone, setTone] = useState('formal');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleGenerate = async () => {
    if (!recipient || !purpose) {
      toast.error('Please provide recipient and purpose.');
      return;
    }
    setLoading(true);
    setError(false);
    setOutput('');

    try {
      const prompt = `Write an email to ${recipient}. Purpose: ${purpose}. Tone: ${tone}. Include a subject line. Format it professionally.`;
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, systemPrompt: 'You are an expert business communicator.' })
      });

      if (!res.ok) throw new Error('API failed');
      const data = await res.json();
      setOutput(data.result || '');
      toast.success('Email generated successfully!');
    } catch (err) {
      console.error(err);
      setError(true);
      toast.error('Failed to generate email.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="glass p-6 rounded-2xl space-y-4">
      <h3 className="text-lg font-bold">AI Email Generator</h3>
      <div className="space-y-3">
        <input 
          type="text" 
          placeholder="Recipient (e.g., John Doe)" 
          className="w-full bg-surface border border-border rounded-xl py-2 px-4 text-sm"
          value={recipient}
          onChange={e => setRecipient(e.target.value)}
        />
        <textarea 
          placeholder="Purpose (e.g., follow up on the proposal)" 
          className="w-full bg-surface border border-border rounded-xl py-2 px-4 text-sm resize-none"
          rows={2}
          value={purpose}
          onChange={e => setPurpose(e.target.value)}
        />
        <select 
          className="w-full bg-surface border border-border rounded-xl py-2 px-4 text-sm outline-none"
          value={tone}
          onChange={e => setTone(e.target.value)}
        >
          <option value="formal">Formal</option>
          <option value="friendly">Friendly</option>
          <option value="urgent">Urgent</option>
        </select>

        <button 
          onClick={handleGenerate} 
          disabled={loading}
          className="w-full bg-accent hover:bg-accent/90 text-white font-semibold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : 'Generate with AI'}
        </button>
      </div>

      {error && (
        <button onClick={handleGenerate} className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300">
          <RefreshCw size={14} /> Retry Generation
        </button>
      )}

      {loading && !output && (
        <div className="space-y-2 mt-4">
          <div className="h-4 bg-white/5 rounded skeleton w-3/4"></div>
          <div className="h-4 bg-white/5 rounded skeleton w-full"></div>
          <div className="h-4 bg-white/5 rounded skeleton w-5/6"></div>
        </div>
      )}

      {output && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
          <textarea 
            className="w-full bg-black/20 border border-border rounded-xl py-3 px-4 text-sm min-h-[150px] resize-y"
            value={output}
            onChange={e => setOutput(e.target.value)}
          />
          <div className="flex gap-3 mt-3">
            <button onClick={copyToClipboard} className="flex-1 glass hover:bg-white/10 py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2">
              <Copy size={16} /> Copy
            </button>
            <button onClick={() => toast.success('Sent! (Mock)')} className="flex-1 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2">
              <Send size={16} /> Send
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
