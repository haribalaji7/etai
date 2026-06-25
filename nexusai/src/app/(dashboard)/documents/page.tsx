'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { GlassCard, RippleButton } from '@/components/ui/shared';
import { File, UploadCloud, Search, Eye, FileText, Trash2, Sparkles, BrainCircuit } from 'lucide-react';

interface Doc {
  id: string;
  name: string;
  size: string;
  type: string;
  date: string;
  summary?: string;
  ocrText?: string;
}

export default function DocumentsPage() {
  const [docs, setDocs] = useState<Doc[]>([
    { id: '1', name: 'financial-report-2024.pdf', size: '2.4 MB', type: 'PDF', date: '2024-12-10', summary: 'This document presents the financial outlook of the company for the fiscal year 2024, demonstrating a 15% upward trajectory in net profit margins.' },
    { id: '2', name: 'terms-of-service.docx', size: '512 KB', type: 'Word', date: '2024-12-08' },
    { id: '3', name: 'invoice-nexus-4889.pdf', size: '124 KB', type: 'PDF', date: '2024-12-12' },
  ]);
  const [selectedDoc, setSelectedDoc] = useState<Doc | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessingOCR, setIsProcessingOCR] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    toast.promise(
      new Promise<Doc>(r => setTimeout(() => {
        const newDoc: Doc = {
          id: Math.random().toString(),
          name: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          type: file.name.split('.').pop()?.toUpperCase() || 'Doc',
          date: new Date().toISOString().split('T')[0],
        };
        r(newDoc);
      }, 1500)),
      {
        loading: 'Uploading document...',
        success: (newD) => {
          setDocs(prev => [newD, ...prev]);
          setIsUploading(false);
          return 'Document uploaded successfully!';
        },
        error: 'Upload failed',
      }
    );
  };

  const handleRunOCR = (doc: Doc) => {
    setIsProcessingOCR(true);
    toast.promise(
      new Promise<string>(r => setTimeout(() => {
        r('TEXT EXTRACTED: \nInvoice ID: #8892\nAmount Due: $1,450.00\nDue Date: 2024-12-25\nPayment status: PENDING\nMerchant: NexusAI Corp.');
      }, 2000)),
      {
        loading: 'Processing OCR via Tesseract.js...',
        success: (txt) => {
          setDocs(prev => prev.map(d => d.id === doc.id ? { ...d, ocrText: txt } : d));
          if (selectedDoc?.id === doc.id) {
            setSelectedDoc(prev => prev ? { ...prev, ocrText: txt } : null);
          }
          setIsProcessingOCR(false);
          return 'OCR translation complete!';
        },
        error: 'OCR processing failed',
      }
    );
  };

  const handleSummarize = (doc: Doc) => {
    toast.promise(
      new Promise<string>(r => setTimeout(() => {
        r('AI SUMMARY: The document contains invoice parameters stating that a charge of $1,450.00 is billed to NexusAI Corp, scheduled to clear on 2024-12-25.');
      }, 1800)),
      {
        loading: 'Generating AI Summary via Gemini...',
        success: (sum) => {
          setDocs(prev => prev.map(d => d.id === doc.id ? { ...d, summary: sum } : d));
          if (selectedDoc?.id === doc.id) {
            setSelectedDoc(prev => prev ? { ...prev, summary: sum } : null);
          }
          return 'Summary generation complete!';
        },
        error: 'Summarization failed',
      }
    );
  };

  const filteredDocs = docs.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="p-6 space-y-6">
      <div className="border-b border-border pb-4">
        <h2 className="text-xl font-bold text-text-primary">Document Hub</h2>
        <p className="text-xs text-text-muted">Manage company files, translate image text, and compile summaries.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: File Uploader & List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upload Drop Zone */}
          <GlassCard className="p-6 text-center border-dashed border-2 border-border relative hover:border-accent/40 cursor-pointer" hover={false}>
            <input type="file" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" disabled={isUploading} />
            <div className="flex flex-col items-center justify-center space-y-2">
              <UploadCloud size={40} className="text-text-muted animate-bounce" />
              <span className="text-sm font-semibold text-text-primary">Drag and drop file here, or click to browse</span>
              <span className="text-xs text-text-muted">Supports PDF, PNG, JPG, DOCX (Max 10MB)</span>
            </div>
          </GlassCard>

          {/* Search and List */}
          <div className="space-y-4">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-surface border border-border rounded-xl py-2 pl-9 pr-4 text-xs"
              />
            </div>

            <div className="space-y-3">
              {filteredDocs.map(doc => (
                <div key={doc.id} className="glass p-4 flex items-center justify-between hover:glow-border transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                      <FileText size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-text-primary">{doc.name}</h4>
                      <span className="text-[10px] text-text-muted">{doc.size} • {doc.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button onClick={() => setSelectedDoc(doc)} className="text-text-muted hover:text-text-primary p-2 hover:bg-white/5 rounded-xl"><Eye size={16} /></button>
                    {!doc.ocrText && (
                      <button onClick={() => handleRunOCR(doc)} className="text-text-muted hover:text-cyan-400 p-2 hover:bg-cyan-500/10 rounded-xl" title="Run OCR"><BrainCircuit size={16} /></button>
                    )}
                    {!doc.summary && (
                      <button onClick={() => handleSummarize(doc)} className="text-text-muted hover:text-purple-400 p-2 hover:bg-purple-500/10 rounded-xl" title="Summarize with Gemini"><Sparkles size={16} /></button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: File Preview / OCR / AI Summaries */}
        <GlassCard className="p-6 h-fit" hover={false}>
          {selectedDoc ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-border pb-4">
                <h3 className="font-semibold text-sm truncate max-w-[200px]">{selectedDoc.name}</h3>
                <button onClick={() => setSelectedDoc(null)} className="text-text-muted hover:text-text-primary text-xs">Close</button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-text-primary mb-1">OCR Extracted Text</h4>
                  <div className="bg-base border border-border p-3 rounded-xl min-h-[80px] text-xs font-mono whitespace-pre-line text-text-muted">
                    {selectedDoc.ocrText || 'No OCR processed yet. Click the OCR button on the file row to read image content.'}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-text-primary mb-1 font-sans">AI Summary (Gemini)</h4>
                  <div className="bg-base border border-border p-3 rounded-xl min-h-[80px] text-xs leading-relaxed text-text-muted">
                    {selectedDoc.summary || 'No summary compiled yet. Click the Sparkles button on the file row.'}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-text-muted">
              <File size={36} className="mx-auto mb-2 opacity-35" />
              <p className="text-xs">Select a document to preview OCR properties and AI summaries.</p>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
