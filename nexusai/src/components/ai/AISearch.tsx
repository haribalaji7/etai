import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, Sparkles, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

interface SearchResult {
  title: string;
  type: string;
  snippet: string;
  relevance: number;
}

export function AISearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    setResults(null);

    try {
      const prompt = `Search NexusAI enterprise data for: "${query}". 
Return relevant mock results based on the query.

Return ONLY a raw JSON object (no markdown) with this exact structure:
{
  "results": [
    {
      "title": "Document/Entity Name",
      "type": "Document | User | Project | Workflow",
      "snippet": "A brief relevant snippet highlighting the matching data",
      "relevance": 95
    }
  ]
}`;

      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt, 
          systemPrompt: 'You are an intelligent enterprise search engine.',
          responseFormat: 'json'
        })
      });

      if (!res.ok) throw new Error('API failed');
      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      console.error(err);
      toast.error('Search failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <form onSubmit={handleSearch} className="relative group">
        <div className="absolute inset-0 bg-accent/20 blur-xl rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
        <div className="relative flex items-center bg-surface border border-border rounded-2xl p-2 focus-within:border-accent transition-colors shadow-lg shadow-black/20">
          <Search className="text-text-muted ml-3" size={20} />
          <input
            type="text"
            placeholder="Search AI, documents, users, or projects..."
            className="w-full bg-transparent border-none px-4 py-2 text-sm outline-none placeholder:text-text-muted"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button 
            type="submit"
            disabled={loading || !query}
            className="bg-accent text-white p-2 rounded-xl disabled:opacity-50 hover:bg-accent/90 transition-colors flex items-center justify-center min-w-[40px]"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
          </button>
        </div>
      </form>

      <AnimatePresence>
        {results && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }}
            className="glass rounded-2xl border border-border overflow-hidden"
          >
            <div className="p-3 border-b border-border bg-black/20 flex justify-between items-center">
              <span className="text-xs font-semibold text-text-muted">AI Search Results ({results.length})</span>
            </div>
            
            {results.length === 0 ? (
              <div className="p-8 text-center text-text-muted text-sm">
                No relevant data found for "{query}".
              </div>
            ) : (
              <div className="divide-y divide-border max-h-[400px] overflow-y-auto">
                {results.map((item, i) => (
                  <button key={i} className="w-full text-left p-4 hover:bg-white/5 transition-colors flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent flex-shrink-0">
                      {item.type === 'User' ? '👤' : item.type === 'Project' ? '🚀' : item.type === 'Workflow' ? '⚙️' : '📄'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-semibold text-sm truncate pr-4 text-text-primary group-hover:text-accent transition-colors">{item.title}</h4>
                        <span className="text-[10px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full flex-shrink-0">
                          {item.relevance}% Match
                        </span>
                      </div>
                      <p className="text-xs text-text-muted line-clamp-2">{item.snippet}</p>
                    </div>
                    <ChevronRight size={16} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity mt-2" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
