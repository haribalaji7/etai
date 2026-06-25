'use client';

import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';
import { aiAgents, Agent } from '@/lib/data';
import { Avatar, GlassCard, RippleButton } from '@/components/ui/shared';
import { Search, Send, Mic, MicOff, Plus, ChevronDown, Check, Copy } from 'lucide-react';

const DynamicOrbIcon = dynamic(() => import('@/components/three/scenes').then(m => {
  const { Scene3D, FloatingOrbs } = m;
  return function OrbIcon() {
    return (
      <div className="w-8 h-8 relative rounded-full overflow-hidden">
        <Scene3D className="!absolute inset-0 w-full h-full scale-[1.5]">
          <FloatingOrbs />
        </Scene3D>
      </div>
    );
  };
}), { ssr: false, loading: () => <div className="w-8 h-8 skeleton rounded-full" /> });

interface Message {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
}

interface Chat {
  id: string;
  agent: Agent;
  messages: Message[];
}

export default function AIAssistant() {
  const [chats, setChats] = useState<Chat[]>(() => [
    {
      id: '1',
      agent: aiAgents[0], // Orchestrator
      messages: [
        { id: 'm1', sender: 'agent', text: 'Hello! I am the Orchestrator AI. How can I help you coordinate your enterprise tasks today?', timestamp: new Date().toISOString() }
      ]
    }
  ]);
  const [activeChatId, setActiveChatId] = useState('1');
  const [inputVal, setInputVal] = useState('');
  const [searchVal, setSearchVal] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<Agent>(aiAgents[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [audioAmplitude, setAudioAmplitude] = useState<number[]>([10, 10, 10, 10, 10]);
  const [streamingMessage, setStreamingMessage] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const activeChat = chats.find(c => c.id === activeChatId) || chats[0];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat.messages, streamingMessage]);

  // Voice Web Speech API Setup
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = 'en-US';

        rec.onstart = () => {
          setIsRecording(true);
          // Simulate simple audio waves
          const interval = setInterval(() => {
            setAudioAmplitude(Array.from({ length: 8 }, () => Math.floor(Math.random() * 40) + 5));
          }, 100);
          (rec as any)._waveInterval = interval;
        };

        rec.onresult = (event: any) => {
          const text = event.results[0][0].transcript;
          setInputVal(prev => prev + ' ' + text);
        };

        rec.onerror = (e: any) => {
          console.error(e);
          toast.error('Voice recognition failed or permission denied');
          setIsRecording(false);
        };

        rec.onend = () => {
          setIsRecording(false);
          clearInterval((rec as any)._waveInterval);
          setAudioAmplitude([10, 10, 10, 10, 10]);
        };

        recognitionRef.current = rec;
      }
    }
  }, []);

  const toggleVoice = () => {
    if (!recognitionRef.current) {
      toast.error('Voice recognition not supported in this browser');
      return;
    }
    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const handleSend = async () => {
    if (!inputVal.trim() && !isStreaming) return;
    const userMsgText = inputVal.trim();
    setInputVal('');

    // Add User Message
    const userMsg: Message = {
      id: Math.random().toString(),
      sender: 'user',
      text: userMsgText,
      timestamp: new Date().toISOString()
    };

    setChats(prev => prev.map(c => {
      if (c.id === activeChatId) {
        return { ...c, messages: [...c.messages, userMsg] };
      }
      return c;
    }));

    setIsStreaming(true);
    setStreamingMessage('');

    try {
      let accumulatedText = '';
      const messages = activeChat.messages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));
      messages.push({
        role: 'user',
        parts: [{ text: userMsgText }]
      });

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages,
          agentRole: selectedAgent.role,
          systemPrompt: selectedAgent.systemPrompt
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'API request failed');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          accumulatedText += chunk;
          setStreamingMessage(accumulatedText);
        }
      }

      // Commit streaming message to history
      const agentMsg: Message = {
        id: Math.random().toString(),
        sender: 'agent',
        text: accumulatedText || 'Analysis complete.',
        timestamp: new Date().toISOString()
      };

      setChats(prev => prev.map(c => {
        if (c.id === activeChatId) {
          return { ...c, messages: [...c.messages, agentMsg] };
        }
        return c;
      }));
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || 'Failed to communicate with AI model. Please check connection.');
    } finally {
      setIsStreaming(false);
      setStreamingMessage('');
    }
  };

  const handleNewChat = () => {
    const newChatId = Math.random().toString();
    const newChat: Chat = {
      id: newChatId,
      agent: selectedAgent,
      messages: [
        { id: Math.random().toString(), sender: 'agent', text: `Hi! I am the ${selectedAgent.name}. I am now active in this workspace.`, timestamp: new Date().toISOString() }
      ]
    };
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChatId);
    toast.success(`${selectedAgent.name} initiated in new chat`);
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Code copied to clipboard!');
  };

  const filteredChats = chats.filter(c => c.agent.name.toLowerCase().includes(searchVal.toLowerCase()));

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Left panel: Conversation list */}
      <div className="w-[280px] border-r border-border bg-surface flex flex-col h-full flex-shrink-0">
        <div className="p-4 space-y-3 border-b border-border flex-shrink-0">
          <RippleButton onClick={handleNewChat} className="w-full bg-accent hover:bg-accent/90 text-white font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2">
            <Plus size={16} /> New Conversation
          </RippleButton>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              className="w-full bg-base border border-border rounded-xl py-2 pl-9 pr-4 text-xs"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredChats.map(chat => {
            const lastMsg = chat.messages[chat.messages.length - 1];
            const isActive = chat.id === activeChatId;
            return (
              <button
                key={chat.id}
                onClick={() => { setActiveChatId(chat.id); setSelectedAgent(chat.agent); }}
                className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-3 border ${isActive ? 'bg-accent/10 border-accent/20' : 'border-transparent hover:bg-white/5'}`}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0" style={{ backgroundColor: `${chat.agent.color}20` }}>
                  {chat.agent.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <span className="font-semibold text-sm truncate">{chat.agent.name}</span>
                    <span className="text-[10px] text-text-muted">{new Date(lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-xs text-text-muted truncate">{lastMsg.text}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main panel: Chat interface */}
      <div className="flex-1 flex flex-col bg-base overflow-hidden relative">
        {/* Chat header */}
        <div className="h-14 border-b border-border bg-surface px-6 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <DynamicOrbIcon />
            <div>
              <h2 className="text-sm font-semibold text-text-primary">{selectedAgent.name}</h2>
              <span className="text-[10px] text-text-muted font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {selectedAgent.role} (Online)
              </span>
            </div>
          </div>
          {/* Agent selector */}
          <div className="relative group">
            <button className="glass !bg-white/5 hover:!bg-white/10 px-3 py-1.5 !rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors">
              <span>{selectedAgent.icon} {selectedAgent.name}</span>
              <ChevronDown size={14} className="text-text-muted" />
            </button>
            <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-2xl py-1 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all z-40 max-h-60 overflow-y-auto">
              {aiAgents.map(agent => (
                <button
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent)}
                  className="w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: agent.color }} />
                    <span>{agent.icon} {agent.name}</span>
                  </span>
                  {selectedAgent.id === agent.id && <Check size={14} className="text-accent" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Message history */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeChat.messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {msg.sender === 'agent' ? (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0" style={{ backgroundColor: `${activeChat.agent.color}20` }}>
                    {activeChat.agent.icon}
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-xs flex-shrink-0">
                    SC
                  </div>
                )}
                <div>
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-accent text-white rounded-tr-none'
                      : 'glass !bg-white/5 border border-border text-text-primary rounded-tl-none'
                  }`}>
                    {msg.sender === 'agent' ? (
                      <ReactMarkdown
                        components={{
                          code({ node, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || '');
                            return match ? (
                              <div className="my-2 rounded-xl overflow-hidden bg-black/60 border border-border">
                                <div className="flex items-center justify-between px-4 py-1.5 bg-white/5 text-[10px] text-text-muted">
                                  <span>{match[1].toUpperCase()}</span>
                                  <button onClick={() => handleCopyCode(String(children).replace(/\n$/, ''))} className="hover:text-text-primary flex items-center gap-1">
                                    <Copy size={12} /> Copy
                                  </button>
                                </div>
                                <pre className="p-4 text-xs overflow-x-auto text-emerald-400">
                                  <code className={className} {...props}>{children}</code>
                                </pre>
                              </div>
                            ) : (
                              <code className="bg-black/40 px-1.5 py-0.5 rounded text-xs text-rose-400" {...props}>{children}</code>
                            );
                          }
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    ) : (
                      <p>{msg.text}</p>
                    )}
                  </div>
                  <span className="text-[10px] text-text-muted mt-1 block px-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Streaming Assistant message */}
          {isStreaming && streamingMessage && (
            <div className="flex justify-start">
              <div className="max-w-[70%] flex gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0" style={{ backgroundColor: `${activeChat.agent.color}20` }}>
                  {activeChat.agent.icon}
                </div>
                <div>
                  <div className="p-4 rounded-2xl text-sm leading-relaxed glass !bg-white/5 border border-border text-text-primary rounded-tl-none">
                    <ReactMarkdown
                      components={{
                        code({ node, className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || '');
                          return match ? (
                            <div className="my-2 rounded-xl overflow-hidden bg-black/60 border border-border">
                              <div className="flex items-center justify-between px-4 py-1.5 bg-white/5 text-[10px] text-text-muted">
                                <span>{match[1].toUpperCase()}</span>
                                <button onClick={() => handleCopyCode(String(children).replace(/\n$/, ''))} className="hover:text-text-primary flex items-center gap-1">
                                  <Copy size={12} /> Copy
                                </button>
                              </div>
                              <pre className="p-4 text-xs overflow-x-auto text-emerald-400">
                                <code className={className} {...props}>{children}</code>
                              </pre>
                            </div>
                          ) : (
                            <code className="bg-black/40 px-1.5 py-0.5 rounded text-xs text-rose-400" {...props}>{children}</code>
                          );
                        }
                      }}
                    >
                      {streamingMessage}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-border bg-surface flex-shrink-0">
          <div className="max-w-4xl mx-auto flex gap-3 items-end">
            <button
              onClick={toggleVoice}
              className={`p-3 rounded-xl border transition-all ${
                isRecording
                  ? 'bg-red-500/20 border-red-500/40 text-red-400'
                  : 'glass !bg-white/5 hover:!bg-white/10 border-border text-text-muted hover:text-text-primary'
              }`}
            >
              {isRecording ? <MicOff size={20} className="animate-pulse" /> : <Mic size={20} />}
            </button>
            <div className="flex-1 relative glass !bg-white/5 border border-border rounded-xl overflow-hidden flex items-end">
              <textarea
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                placeholder={isRecording ? 'Listening...' : 'Type a message...'}
                className="w-full bg-transparent border-0 p-3 pr-10 text-sm outline-none resize-none max-h-32 placeholder:text-text-muted"
                rows={1}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              />
              {isRecording && (
                <div className="absolute right-3 bottom-3 flex items-end gap-0.5">
                  {audioAmplitude.map((h, i) => (
                    <div key={i} className="w-1 bg-accent rounded-full transition-all duration-100" style={{ height: `${h}px` }} />
                  ))}
                </div>
              )}
            </div>
            <RippleButton onClick={handleSend} className="bg-accent hover:bg-accent/90 text-white p-3 rounded-xl">
              <Send size={20} />
            </RippleButton>
          </div>
        </div>
      </div>
    </div>
  );
}
