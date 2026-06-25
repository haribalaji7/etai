import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FileText, Loader2, Copy, UploadCloud, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

interface DocResult {
  summary: string;
  keyPoints: string[];
  category: string;
  tags: string[];
}

export function DocSummarizer() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<DocResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // In a real app, we'd parse the PDF. Here we mock it by filling the textarea.
    toast.success(`Mock extracted text from ${file.name}`);
    setText(`[Content extracted from ${file.name}]\n\nNexusAI Q3 Performance Report:\nRevenue grew by 24% compared to Q2, driven by new enterprise sales in the APAC region. Churn rate decreased to 1.2%, hitting an all-time low. The new AI workflow builder saw 85% adoption among active users within the first month. Our key challenge remains scaling the database infrastructure to handle the 3x increase in API requests.`);
  };

  const handleSummarize = async () => {
    if (!text.trim()) {
      toast.error('Please paste document text or upload a file.');
      return;
    }
    setLoading(true);
    setError(false);
    setResult(null);

    try {
      const prompt = `Analyze the following document text and extract:
1. A concise summary
2. Key points (3-4 items)
3. Category (e.g., Financial, Technical, HR)
4. Suggested tags (3-5 relevant tags)

Return ONLY a raw JSON object (no markdown) with this exact structure:
{
  "summary": "Brief summary here...",
  "keyPoints": ["point 1", "point 2"],
  "category": "Category Name",
  "tags": ["tag1", "tag2"]
}

Document Text:
${text}`;

      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt, 
          systemPrompt: 'You are an expert document analyst AI.',
          responseFormat: 'json'
        })
      });

      if (!res.ok) throw new Error('API failed');
      const data = await res.json();
      setResult(data);
      toast.success('Document summarized!');
    } catch (err) {
      console.error(err);
      setError(true);
      toast.error('Failed to summarize document.');
    } finally {
      setLoading(false);
    }
  };

  const copySummary = () => {
    if (result) {
      navigator.clipboard.writeText(result.summary);
      toast.success('Summary copied!');
    }
  };

  return (
    <div className="glass p-6 rounded-2xl space-y-4">
      <h3 className="text-lg font-bold flex items-center gap-2">
        <FileText className="text-accent" /> AI Document Summarizer
      </h3>
      
      <div className="relative">
        <textarea 
          placeholder="Paste document text here..." 
          className="w-full bg-surface border border-border rounded-xl py-3 px-4 text-sm resize-y min-h-[100px]"
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <input 
          type="file" 
          accept=".pdf,.txt,.docx" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleFileUpload}
        />
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="absolute right-3 bottom-4 text-text-muted hover:text-accent transition-colors bg-base p-1.5 rounded-lg border border-border"
          title="Upload Document"
        >
          <UploadCloud size={16} />
        </button>
      </div>

      <button 
        onClick={handleSummarize} 
        disabled={loading}
        className="w-full bg-accent hover:bg-accent/90 text-white font-semibold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
      >
        {loading ? <Loader2 className="animate-spin" size={16} /> : 'Analyze Document'}
      </button>

      {error && (
        <button onClick={handleSummarize} className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300">
          <RefreshCw size={14} /> Retry Analysis
        </button>
      )}

      {loading && !result && (
        <div className="space-y-3 mt-4 bg-surface p-4 rounded-xl border border-border">
          <div className="h-4 bg-white/5 rounded skeleton w-full"></div>
          <div className="h-4 bg-white/5 rounded skeleton w-5/6"></div>
          <div className="h-4 bg-white/5 rounded skeleton w-4/6"></div>
        </div>
      )}

      {result && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-4 p-5 border border-border bg-surface rounded-xl relative group">
          <button onClick={copySummary} className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors">
            <Copy size={16} />
          </button>
          
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-accent/20 text-accent px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
              {result.category}
            </span>
            <div className="flex gap-1 flex-wrap">
              {result.tags?.map((tag, i) => (
                <span key={i} className="bg-white/5 border border-border text-text-muted px-2 py-1 rounded-md text-[10px]">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <h4 className="font-semibold text-sm mb-1 text-text-primary">Summary</h4>
          <p className="text-sm text-text-muted leading-relaxed mb-4">
            {result.summary}
          </p>

          <h4 className="font-semibold text-sm mb-2 text-text-primary">Key Points</h4>
          <ul className="list-disc pl-4 space-y-1 text-xs text-text-muted">
            {result.keyPoints?.map((point, i) => <li key={i}>{point}</li>)}
          </ul>
        </motion.div>
      )}
    </div>
  );
}
