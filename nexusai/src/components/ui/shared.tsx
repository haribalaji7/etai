'use client';

import { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface CounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
  duration?: number;
}

export function AnimatedCounter({ value, prefix = '', suffix = '', decimals = 0, className = '', duration = 1.5 }: CounterProps) {
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: duration * 1000, bounce: 0 });
  const display = useTransform(springValue, (v) => {
    const num = decimals > 0 ? v.toFixed(decimals) : Math.round(v).toLocaleString();
    return `${prefix}${num}${suffix}`;
  });

  useEffect(() => { motionValue.set(value); }, [motionValue, value]);

  return <motion.span className={className}>{display}</motion.span>;
}

export function SkeletonBlock({ className = '' }: { className?: string }) {
  return <div className={`skeleton ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="glass p-6 space-y-4">
      <SkeletonBlock className="h-4 w-1/3" />
      <SkeletonBlock className="h-8 w-2/3" />
      <SkeletonBlock className="h-3 w-1/2" />
    </div>
  );
}

export function EmptyState({ title, description, icon }: { title: string; description: string; icon?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" className="mb-6 opacity-30">
        <circle cx="60" cy="60" r="50" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
        <circle cx="60" cy="60" r="30" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
        <text x="60" y="65" textAnchor="middle" fill="currentColor" fontSize="24">{icon || '📭'}</text>
      </svg>
      <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
      <p className="text-text-muted text-sm max-w-sm">{description}</p>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    success: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    error: 'bg-red-500/20 text-red-400 border-red-500/30',
    active: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    inactive: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
    away: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    idle: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
    running: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${colors[status] || colors.active}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export function Avatar({ name, src, size = 32 }: { name: string; src?: string; size?: number }) {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const colors = ['bg-violet-600', 'bg-blue-600', 'bg-emerald-600', 'bg-amber-600', 'bg-rose-600', 'bg-cyan-600'];
  const colorIdx = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % colors.length;

  return (
    <div
      className={`${colors[colorIdx]} rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 overflow-hidden`}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
      ) : initials}
    </div>
  );
}

export function RippleButton({ children, className = '', onClick, disabled = false, loading = false }: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;
    const btn = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.cssText = `position:absolute;border-radius:50%;background:rgba(255,255,255,0.3);width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px;animation:ripple 0.6s ease-out;pointer-events:none;`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
    onClick?.();
  };

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      className={`relative overflow-hidden ${className}`}
      onClick={handleClick}
      disabled={disabled || loading}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 inline" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </motion.button>
  );
}

export function GlassCard({ children, className = '', hover = true }: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <motion.div
      className={`glass ${className}`}
      whileHover={hover ? { y: -6, transition: { duration: 0.2 } } : undefined}
    >
      {children}
    </motion.div>
  );
}

export function PageSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <SkeletonBlock className="h-8 w-48" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass p-6"><SkeletonBlock className="h-64 w-full" /></div>
        <div className="glass p-6"><SkeletonBlock className="h-64 w-full" /></div>
      </div>
    </div>
  );
}


