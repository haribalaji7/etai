'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppSelector, useAppDispatch, toggleSidebar, toggleCommandPalette, setCommandPaletteOpen } from '@/store/store';
import { navItems } from '@/lib/data';
import { getInitials } from '@/lib/utils';
import {
  LayoutDashboard, Bot, GitBranch, FolderKanban, BarChart3, FileText,
  Calendar, Users, DollarSign, Target, Settings, HelpCircle,
  ChevronLeft, Bell, Search, Menu
} from 'lucide-react';
import { CommandPalette } from '@/components/command-palette';

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard, Bot, GitBranch, FolderKanban, BarChart3, FileText,
  Calendar, Users, DollarSign, Target, Settings, HelpCircle,
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { sidebarCollapsed, commandPaletteOpen } = useAppSelector(s => s.ui);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        dispatch(toggleCommandPalette());
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [dispatch]);

  const currentPage = navItems.find(n => pathname.startsWith(n.href))?.label || 'Dashboard';

  return (
    <div className="flex h-screen bg-base overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        className="relative z-20 bg-surface border-r border-border flex flex-col h-full flex-shrink-0"
        animate={{ width: sidebarCollapsed ? 64 : 240 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 gap-2 border-b border-border flex-shrink-0">
          <span className="text-xl font-bold gradient-text flex-shrink-0">NX</span>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }} className="text-sm font-semibold text-text-primary overflow-hidden whitespace-nowrap">
                NexusAI
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const Icon = iconMap[item.icon] || LayoutDashboard;
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} className="relative block">
                {isActive && (
                  <motion.div
                    layoutId="sidebar-pill"
                    className="absolute inset-0 bg-accent/10 border border-accent/20 rounded-xl"
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  />
                )}
                <div className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${isActive ? 'text-accent' : 'text-text-muted hover:text-text-primary hover:bg-white/5'}`}>
                  <Icon size={20} />
                  <AnimatePresence>
                    {!sidebarCollapsed && (
                      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm font-medium overflow-hidden whitespace-nowrap">
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-xs flex-shrink-0">
              {getInitials('Sarah Chen')}
            </div>
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">Sarah Chen</div>
                  <div className="text-xs text-text-muted truncate">Manager</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="absolute -right-3 top-20 w-6 h-6 bg-surface border border-border rounded-full flex items-center justify-center hover:bg-card transition-colors z-30"
        >
          <motion.div animate={{ rotate: sidebarCollapsed ? 180 : 0 }}>
            <ChevronLeft size={14} />
          </motion.div>
        </button>
      </motion.aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 border-b border-border bg-surface/80 backdrop-blur-xl flex items-center justify-between px-6 flex-shrink-0 z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => dispatch(toggleSidebar())} className="lg:hidden text-text-muted hover:text-text-primary">
              <Menu size={20} />
            </button>
            <div className="text-sm text-text-muted">
              <span className="text-text-primary font-medium">{currentPage}</span>
            </div>
          </div>

          <button
            onClick={() => dispatch(setCommandPaletteOpen(true))}
            className="hidden sm:flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-2 text-sm text-text-muted hover:border-accent/30 transition-colors max-w-xs"
          >
            <Search size={16} />
            <span className="flex-1 text-left">Search or press ⌘K</span>
            <kbd className="text-xs bg-surface px-1.5 py-0.5 rounded border border-border">⌘K</kbd>
          </button>

          <div className="flex items-center gap-3">
            <Link href="/notifications" className="relative p-2 text-text-muted hover:text-text-primary transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </Link>
            <Link href="/settings" className="p-2 text-text-muted hover:text-text-primary transition-colors">
              <Settings size={20} />
            </Link>
            <Link href="/profile" className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-xs">
              SC
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-base">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Command Palette */}
      <CommandPalette open={commandPaletteOpen} onClose={() => dispatch(setCommandPaletteOpen(false))} />
    </div>
  );
}
