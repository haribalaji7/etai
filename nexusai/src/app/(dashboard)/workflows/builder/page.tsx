'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Plus, Undo2, Redo2, ZoomIn, ZoomOut, RotateCcw, Save, Layers, X, Trash2, Check, User } from 'lucide-react';
import { sampleUsers } from '@/lib/data';
import { RippleButton, GlassCard } from '@/components/ui/shared';

interface Node {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'ai' | 'approval' | 'end';
  x: number;
  y: number;
  title: string;
  config: Record<string, any>;
}

interface Connection {
  id: string;
  fromId: string;
  fromPort: 'output' | 'true' | 'false';
  toId: string;
}

const templates = [
  { name: 'Lead Qualification AI', desc: 'Qualify inbound leads using AI analysis and automatically assign tasks.' },
  { name: 'Expense Approval', desc: 'Route expense requests to managers and process finance payouts.' },
  { name: 'Customer Support Escalation', desc: 'Intelligently route support requests to engineers based on severity.' },
  { name: 'Document Summarizer Pipeline', desc: 'OCR upload documents, run summarization, and email reports.' },
  { name: 'Automated Invoice Generator', desc: 'Build finance invoices on payment arrival notifications.' },
  { name: 'HR Onboarding Dispatcher', desc: 'Initialize task arrays when a new employee is registered.' },
];

export default function WorkflowBuilder() {
  // Canvas State
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const startPan = useRef({ x: 0, y: 0 });

  // Nodes & Connections State
  const [nodes, setNodes] = useState<Node[]>([
    { id: '1', type: 'trigger', x: 100, y: 150, title: 'Inbound Lead Trigger', config: { event: 'webhook' } },
    { id: '2', type: 'ai', x: 380, y: 130, title: 'Lead Risk Evaluator', config: { model: 'gemini-1.5-pro' } },
    { id: '3', type: 'condition', x: 660, y: 150, title: 'Is High Risk?', config: {} },
    { id: '4', type: 'approval', x: 940, y: 50, title: 'Manager Review', config: { assignee: 'Sarah Chen' } },
    { id: '5', type: 'action', x: 940, y: 280, title: 'Auto-approve & Save', config: { actionType: 'database' } },
  ]);

  const [connections, setConnections] = useState<Connection[]>([
    { id: 'c1', fromId: '1', fromPort: 'output', toId: '2' },
    { id: 'c2', fromId: '2', fromPort: 'output', toId: '3' },
    { id: 'c3', fromId: '3', fromPort: 'true', toId: '4' },
    { id: 'c4', fromId: '3', fromPort: 'false', toId: '5' },
  ]);

  // UI Selection State
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedConnectionId, setSelectedConnectionId] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);

  // Connection Drag State
  const [activeDragPort, setActiveDragPort] = useState<{ nodeId: string; portType: 'output' | 'true' | 'false' } | null>(null);
  const [tempLineEnd, setTempLineEnd] = useState({ x: 0, y: 0 });

  // History State (Undo/Redo)
  const [history, setHistory] = useState<{ nodes: Node[]; connections: Connection[] }[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);

  const dragNodeRef = useRef<{ id: string; startX: number; startY: number; mouseStartX: number; mouseStartY: number } | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Save State to History helper
  const pushStateToHistory = (newNodes: Node[], newConns: Connection[]) => {
    const nextHist = history.slice(0, historyIdx + 1);
    nextHist.push({ nodes: newNodes, connections: newConns });
    setHistory(nextHist);
    setHistoryIdx(nextHist.length - 1);
  };

  // Canvas Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.shiftKey)) {
      setIsPanning(true);
      startPan.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - startPan.current.x,
        y: e.clientY - startPan.current.y,
      });
      return;
    }

    if (dragNodeRef.current) {
      const dx = (e.clientX - dragNodeRef.current.mouseStartX) / zoom;
      const dy = (e.clientY - dragNodeRef.current.mouseStartY) / zoom;
      setNodes(prev => prev.map(n => {
        if (n.id === dragNodeRef.current?.id) {
          return {
            ...n,
            x: Math.round((dragNodeRef.current.startX + dx) / 12) * 12, // snap to grid
            y: Math.round((dragNodeRef.current.startY + dy) / 12) * 12,
          };
        }
        return n;
      }));
      return;
    }

    if (activeDragPort && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      setTempLineEnd({
        x: (e.clientX - rect.left - pan.x) / zoom,
        y: (e.clientY - rect.top - pan.y) / zoom,
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    if (dragNodeRef.current) {
      pushStateToHistory(nodes, connections);
      dragNodeRef.current = null;
    }
    setActiveDragPort(null);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = 0.1;
    let nextZoom = zoom - e.deltaY * 0.002;
    nextZoom = Math.min(Math.max(nextZoom, 0.3), 2.0);
    setZoom(nextZoom);
  };

  // Node Drag Trigger
  const handleNodeMouseDown = (e: React.MouseEvent, node: Node) => {
    e.stopPropagation();
    if (e.shiftKey) return;
    setSelectedNodeId(node.id);
    setSelectedConnectionId(null);
    dragNodeRef.current = {
      id: node.id,
      startX: node.x,
      startY: node.y,
      mouseStartX: e.clientX,
      mouseStartY: e.clientY,
    };
  };

  // Connection Drawing helper
  const drawBezierPath = (x1: number, y1: number, x2: number, y2: number) => {
    const dx = Math.abs(x2 - x1) * 0.5;
    return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
  };

  // Port connection triggers
  const handlePortMouseDown = (e: React.MouseEvent, nodeId: string, portType: 'output' | 'true' | 'false') => {
    e.stopPropagation();
    e.preventDefault();
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
    setActiveDragPort({ nodeId, portType });
    // calculate start position
    const startX = node.x + 200;
    const startY = portType === 'output' ? node.y + 40 : portType === 'true' ? node.y + 25 : node.y + 55;
    setTempLineEnd({ x: startX, y: startY });
  };

  const handlePortMouseUp = (e: React.MouseEvent, toNodeId: string) => {
    e.stopPropagation();
    if (activeDragPort && activeDragPort.nodeId !== toNodeId) {
      // Check if duplicate connection already exists
      const exists = connections.some(c => c.fromId === activeDragPort.nodeId && c.fromPort === activeDragPort.portType && c.toId === toNodeId);
      if (!exists) {
        const newConn: Connection = {
          id: Math.random().toString(),
          fromId: activeDragPort.nodeId,
          fromPort: activeDragPort.portType,
          toId: toNodeId,
        };
        const nextConns = [...connections, newConn];
        setConnections(nextConns);
        pushStateToHistory(nodes, nextConns);
        toast.success('Connection established');
      }
    }
    setActiveDragPort(null);
  };

  // Add Node helper
  const addNode = (type: Node['type']) => {
    const defaultTitles: Record<Node['type'], string> = {
      trigger: 'New Trigger Event',
      action: 'Execute Task API',
      condition: 'Verify Condition',
      ai: 'Evaluate Prompt Node',
      approval: 'HR Approval Requested',
      end: 'Finalize Workflow',
    };

    const nextNodes: Node[] = [
      ...nodes,
      {
        id: Math.random().toString(),
        type,
        x: -pan.x / zoom + 200 + Math.random() * 50,
        y: -pan.y / zoom + 150 + Math.random() * 50,
        title: defaultTitles[type],
        config: {},
      },
    ];
    setNodes(nextNodes);
    pushStateToHistory(nextNodes, connections);
    toast.success(`${type.toUpperCase()} node added`);
  };

  // Keyboard undo/redo support
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          // Redo
          if (historyIdx < history.length - 1) {
            const nextIdx = historyIdx + 1;
            setHistoryIdx(nextIdx);
            setNodes(history[nextIdx].nodes);
            setConnections(history[nextIdx].connections);
            toast.success('Redone');
          }
        } else {
          // Undo
          if (historyIdx > 0) {
            const prevIdx = historyIdx - 1;
            setHistoryIdx(prevIdx);
            setNodes(history[prevIdx].nodes);
            setConnections(history[prevIdx].connections);
            toast.success('Undone');
          }
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [history, historyIdx]);

  // Load Template helper
  const loadTemplate = (name: string) => {
    toast.success(`Loaded template: ${name}`);
    setShowTemplates(false);
    // Preset mock layout nodes
    setNodes([
      { id: '1', type: 'trigger', x: 80, y: 150, title: 'Inbound Webhook', config: {} },
      { id: '2', type: 'ai', x: 340, y: 120, title: 'Sentiment Analyzer', config: { model: 'gemini-1.5-pro' } },
      { id: '3', type: 'condition', x: 600, y: 150, title: 'Is Positive?', config: {} },
      { id: '4', type: 'action', x: 860, y: 50, title: 'Notify Slack', config: {} },
      { id: '5', type: 'end', x: 1100, y: 200, title: 'End Pipeline', config: {} },
    ]);
    setConnections([
      { id: 'c1', fromId: '1', fromPort: 'output', toId: '2' },
      { id: 'c2', fromId: '2', fromPort: 'output', toId: '3' },
      { id: 'c3', fromId: '3', fromPort: 'true', toId: '4' },
      { id: 'c4', fromId: '3', fromPort: 'false', toId: '5' },
    ]);
  };

  const handleSave = () => {
    toast.promise(
      new Promise(r => setTimeout(r, 1200)),
      {
        loading: 'Saving workflow to database...',
        success: 'Workflow saved successfully!',
        error: 'Save failed',
      }
    );
  };

  const deleteNode = (id: string) => {
    const nextNodes = nodes.filter(n => n.id !== id);
    const nextConns = connections.filter(c => c.fromId !== id && c.toId !== id);
    setNodes(nextNodes);
    setConnections(nextConns);
    setSelectedNodeId(null);
    pushStateToHistory(nextNodes, nextConns);
    toast.success('Node deleted');
  };

  const deleteConnection = (id: string) => {
    const nextConns = connections.filter(c => c.id !== id);
    setConnections(nextConns);
    setSelectedConnectionId(null);
    pushStateToHistory(nodes, nextConns);
    toast.success('Connection deleted');
  };

  // Node position cache for connecting lines
  const nodeMap = useMemo(() => {
    const map: Record<string, Node> = {};
    nodes.forEach(n => { map[n.id] = n; });
    return map;
  }, [nodes]);

  const activeNode = nodes.find(n => n.id === selectedNodeId);

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] bg-base overflow-hidden" ref={canvasRef} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onWheel={handleWheel}>
      {/* DOT GRID */}
      <div className="absolute inset-0 dot-grid opacity-15 pointer-events-none" style={{ backgroundPosition: `${pan.x}px ${pan.y}px`, backgroundSize: `${24 * zoom}px ${24 * zoom}px` }} />

      {/* CANVAS CONTAINER */}
      <div className="absolute inset-0 pointer-events-none" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: '0 0' }}>
        {/* SVG Connections layer */}
        <svg className="absolute overflow-visible w-full h-full pointer-events-auto">
          {connections.map(conn => {
            const fromNode = nodeMap[conn.fromId];
            const toNode = nodeMap[conn.toId];
            if (!fromNode || !toNode) return null;

            const fromX = fromNode.x + 200;
            const fromY = conn.fromPort === 'output' ? fromNode.y + 40 : conn.fromPort === 'true' ? fromNode.y + 25 : fromNode.y + 55;
            const toX = toNode.x;
            const toY = toNode.y + 40;

            const isSelected = selectedConnectionId === conn.id;

            return (
              <path
                key={conn.id}
                d={drawBezierPath(fromX, fromY, toX, toY)}
                fill="none"
                stroke={isSelected ? '#7c3aed' : 'rgba(255,255,255,0.2)'}
                strokeWidth={isSelected ? 3 : 2}
                className="cursor-pointer hover:stroke-accent/60 transition-colors"
                onClick={(e) => { e.stopPropagation(); setSelectedConnectionId(conn.id); setSelectedNodeId(null); }}
              />
            );
          })}

          {/* Active drawing temp connection */}
          {activeDragPort && (
            <path
              d={drawBezierPath(
                nodeMap[activeDragPort.nodeId].x + 200,
                activeDragPort.portType === 'output' ? nodeMap[activeDragPort.nodeId].y + 40 : activeDragPort.portType === 'true' ? nodeMap[activeDragPort.nodeId].y + 25 : nodeMap[activeDragPort.nodeId].y + 55,
                tempLineEnd.x,
                tempLineEnd.y
              )}
              fill="none"
              stroke="#7c3aed"
              strokeWidth={2}
              strokeDasharray="4 4"
            />
          )}
        </svg>

        {/* NODES LAYER */}
        <div className="absolute inset-0 pointer-events-auto">
          {nodes.map(node => {
            const borderColors = {
              trigger: 'border-l-emerald-500 border-l-4',
              action: 'border-l-blue-500 border-l-4',
              condition: 'border-l-amber-500 border-l-4',
              ai: 'border-l-purple-500 border-l-4 glow-border',
              approval: 'border-l-orange-500 border-l-4',
              end: 'border-l-zinc-500 border-l-4',
            };

            const isSelected = selectedNodeId === node.id;

            return (
              <div
                key={node.id}
                onMouseDown={(e) => handleNodeMouseDown(e, node)}
                onMouseUp={(e) => handlePortMouseUp(e, node.id)}
                className={`absolute w-[200px] h-[80px] glass p-3 cursor-grab active:cursor-grabbing select-none flex flex-col justify-between ${borderColors[node.type]} ${isSelected ? 'accent-ring' : ''}`}
                style={{ left: node.x, top: node.y }}
              >
                {/* Input port */}
                {node.type !== 'trigger' && (
                  <div
                    className="absolute -left-2 top-[34px] w-4 h-4 rounded-full bg-surface border-2 border-border hover:bg-accent/40 cursor-crosshair z-10"
                    onMouseUp={(e) => handlePortMouseUp(e, node.id)}
                  />
                )}

                {/* Content */}
                <div>
                  <div className="text-[10px] uppercase font-bold text-text-muted">
                    {node.type === 'trigger' && '⚡ Trigger'}
                    {node.type === 'action' && '▶ Action'}
                    {node.type === 'condition' && '◆ Condition'}
                    {node.type === 'ai' && '🤖 AI'}
                    {node.type === 'approval' && '👤 Approval'}
                    {node.type === 'end' && '⏹ End'}
                  </div>
                  <div className="text-xs font-semibold text-text-primary mt-1 truncate">{node.title}</div>
                </div>

                {/* Output port(s) */}
                {node.type === 'condition' ? (
                  <>
                    <div className="absolute -right-2 top-[18px] flex items-center justify-end z-10">
                      <span className="text-[8px] font-bold text-emerald-400 mr-1">T</span>
                      <div
                        className="w-4 h-4 rounded-full bg-surface border-2 border-border hover:bg-emerald-500 cursor-crosshair"
                        onMouseDown={(e) => handlePortMouseDown(e, node.id, 'true')}
                      />
                    </div>
                    <div className="absolute -right-2 top-[46px] flex items-center justify-end z-10">
                      <span className="text-[8px] font-bold text-red-400 mr-1">F</span>
                      <div
                        className="w-4 h-4 rounded-full bg-surface border-2 border-border hover:bg-red-500 cursor-crosshair"
                        onMouseDown={(e) => handlePortMouseDown(e, node.id, 'false')}
                      />
                    </div>
                  </>
                ) : (
                  node.type !== 'end' && (
                    <div
                      className="absolute -right-2 top-[34px] w-4 h-4 rounded-full bg-surface border-2 border-border hover:bg-accent/40 cursor-crosshair z-10"
                      onMouseDown={(e) => handlePortMouseDown(e, node.id, 'output')}
                    />
                  )
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* TOOLBAR (Top Glass) */}
      <div className="absolute top-6 left-6 right-6 z-30 flex items-center justify-between">
        <GlassCard className="p-2 px-4 flex items-center gap-3" hover={false}>
          {/* Add node dropdown */}
          <div className="relative group">
            <button className="bg-accent hover:bg-accent/90 text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5">
              <Plus size={14} /> Add Node
            </button>
            <div className="absolute left-0 mt-2 w-44 bg-card border border-border rounded-xl shadow-2xl py-1 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all">
              {['trigger', 'action', 'condition', 'ai', 'approval', 'end'].map(t => (
                <button
                  key={t}
                  onClick={() => addNode(t as Node['type'])}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-white/5 transition-colors"
                >
                  {t.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="w-px h-6 bg-border" />

          {/* Undo/Redo */}
          <button onClick={() => {}} className="text-text-muted hover:text-text-primary p-1.5 rounded-lg hover:bg-white/5"><Undo2 size={16} /></button>
          <button onClick={() => {}} className="text-text-muted hover:text-text-primary p-1.5 rounded-lg hover:bg-white/5"><Redo2 size={16} /></button>

          <div className="w-px h-6 bg-border" />

          {/* Zoom Actions */}
          <button onClick={() => setZoom(z => Math.min(z + 0.1, 2))} className="text-text-muted hover:text-text-primary p-1.5 rounded-lg hover:bg-white/5"><ZoomIn size={16} /></button>
          <button onClick={() => setZoom(z => Math.max(z - 0.1, 0.3))} className="text-text-muted hover:text-text-primary p-1.5 rounded-lg hover:bg-white/5"><ZoomOut size={16} /></button>
          <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} className="text-text-muted hover:text-text-primary p-1.5 rounded-lg hover:bg-white/5"><RotateCcw size={16} /></button>
        </GlassCard>

        <div className="flex items-center gap-3">
          <button onClick={() => setShowTemplates(true)} className="glass !bg-white/5 hover:!bg-white/10 text-text-primary px-4 py-2 !rounded-xl text-xs font-semibold flex items-center gap-1.5">
            <Layers size={14} /> Templates
          </button>
          <button onClick={handleSave} className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5">
            <Save size={14} /> Save Flow
          </button>
        </div>
      </div>

      {/* CONFIG PANEL (Slide-in from right) */}
      <AnimatePresence>
        {activeNode && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="absolute right-0 top-0 bottom-0 w-80 bg-surface border-l border-border z-40 p-6 flex flex-col justify-between"
          >
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-border pb-4">
                <h3 className="font-semibold text-sm">Node Configuration</h3>
                <button onClick={() => setSelectedNodeId(null)} className="text-text-muted hover:text-text-primary"><X size={18} /></button>
              </div>

              <div>
                <label className="text-xs text-text-muted mb-1 block">Title</label>
                <input
                  type="text"
                  value={activeNode.title}
                  onChange={e => {
                    const titleVal = e.target.value;
                    setNodes(prev => prev.map(n => n.id === activeNode.id ? { ...n, title: titleVal } : n));
                  }}
                  className="w-full bg-base border border-border rounded-xl px-3 py-2 text-xs"
                />
              </div>

              {activeNode.type === 'ai' && (
                <div>
                  <label className="text-xs text-text-muted mb-1 block">Model Selector</label>
                  <select
                    value={activeNode.config.model || 'gemini-1.5-pro'}
                    onChange={e => {
                      const modelVal = e.target.value;
                      setNodes(prev => prev.map(n => n.id === activeNode.id ? { ...n, config: { ...n.config, model: modelVal } } : n));
                    }}
                    className="w-full bg-base border border-border rounded-xl px-3 py-2 text-xs"
                  >
                    <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                    <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                    <option value="custom-finetuned">NexusAI Custom v1</option>
                  </select>
                </div>
              )}

              {activeNode.type === 'approval' && (
                <div>
                  <label className="text-xs text-text-muted mb-1 block">Assignee Picker</label>
                  <select
                    value={activeNode.config.assignee || 'Sarah Chen'}
                    onChange={e => {
                      const userVal = e.target.value;
                      setNodes(prev => prev.map(n => n.id === activeNode.id ? { ...n, config: { ...n.config, assignee: userVal } } : n));
                    }}
                    className="w-full bg-base border border-border rounded-xl px-3 py-2 text-xs"
                  >
                    {sampleUsers.map(u => (
                      <option key={u.id} value={u.name}>{u.name} ({u.role})</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <button
              onClick={() => deleteNode(activeNode.id)}
              className="w-full bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <Trash2 size={14} /> Delete Node
            </button>
          </motion.div>
        )}

        {selectedConnectionId && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="absolute right-0 top-0 bottom-0 w-80 bg-surface border-l border-border z-40 p-6 flex flex-col justify-between"
          >
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-border pb-4">
                <h3 className="font-semibold text-sm">Connection Config</h3>
                <button onClick={() => setSelectedConnectionId(null)} className="text-text-muted hover:text-text-primary"><X size={18} /></button>
              </div>
              <p className="text-xs text-text-muted">Delete or modify the properties of this connection line.</p>
            </div>
            <button
              onClick={() => deleteConnection(selectedConnectionId)}
              className="w-full bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <Trash2 size={14} /> Delete Connection
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TEMPLATES MODAL */}
      <AnimatePresence>
        {showTemplates && (
          <>
            <motion.div className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowTemplates(false)} />
            <motion.div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-surface border border-border rounded-2xl z-50 p-6" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
              <div className="flex justify-between items-center border-b border-border pb-4 mb-6">
                <h3 className="font-semibold text-base">Select Workflow Template</h3>
                <button onClick={() => setShowTemplates(false)} className="text-text-muted hover:text-text-primary"><X size={18} /></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map(tmpl => (
                  <button
                    key={tmpl.name}
                    onClick={() => loadTemplate(tmpl.name)}
                    className="glass p-4 text-left hover:glow-border transition-all"
                  >
                    <h4 className="text-sm font-semibold mb-1 text-text-primary">{tmpl.name}</h4>
                    <p className="text-xs text-text-muted leading-relaxed">{tmpl.desc}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
