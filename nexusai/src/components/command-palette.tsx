'use client';

import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import { motion, AnimatePresence } from 'framer-motion';
import { navItems } from '@/lib/data';
import {
  LayoutDashboard, Bot, GitBranch, FolderKanban, BarChart3, FileText,
  Calendar, Users, DollarSign, Target, Settings, HelpCircle,
  Search, Sparkles, Clock, Zap
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard, Bot, GitBranch, FolderKanban, BarChart3, FileText,
  Calendar, Users, DollarSign, Target, Settings, HelpCircle,
};

interface Props {
  open: boolean;
  onClose: () => void;
}

export function CommandPalette({ open, onClose }: Props) {
  const router = useRouter();

  const navigate = (href: string) => {
    router.push(href);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-lg z-50"
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Command className="glass !rounded-2xl overflow-hidden" label="Command Menu">
              <div className="flex items-center gap-3 px-4 border-b border-border">
                <Search size={18} className="text-text-muted flex-shrink-0" />
                <Command.Input
                  placeholder="Type a command or search..."
                  className="flex-1 bg-transparent py-4 text-sm outline-none placeholder:text-text-muted text-text-primary"
                  autoFocus
                />
              </div>
              <Command.List className="max-h-72 overflow-y-auto p-2">
                <Command.Empty className="py-6 text-center text-sm text-text-muted">No results found.</Command.Empty>

                <Command.Group heading="Navigation" className="[&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:text-text-muted [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5">
                  {navItems.map(item => {
                    const Icon = iconMap[item.icon] || LayoutDashboard;
                    return (
                      <Command.Item
                        key={item.href}
                        value={item.label}
                        onSelect={() => navigate(item.href)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-muted cursor-pointer data-[selected=true]:bg-accent/10 data-[selected=true]:text-accent transition-colors"
                      >
                        <Icon size={18} /> {item.label}
                      </Command.Item>
                    );
                  })}
                </Command.Group>

                <Command.Separator className="h-px bg-border my-2" />

                <Command.Group heading="AI Actions" className="[&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:text-text-muted [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5">
                  {[
                    { label: 'Draft an email', icon: Sparkles },
                    { label: 'Summarize document', icon: FileText },
                    { label: 'Analyze risk', icon: Zap },
                  ].map(action => (
                    <Command.Item
                      key={action.label}
                      value={action.label}
                      onSelect={() => { navigate('/ai'); }}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-muted cursor-pointer data-[selected=true]:bg-accent/10 data-[selected=true]:text-accent transition-colors"
                    >
                      <action.icon size={18} /> {action.label}
                    </Command.Item>
                  ))}
                </Command.Group>

                <Command.Separator className="h-px bg-border my-2" />

                <Command.Group heading="Recent" className="[&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:text-text-muted [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5">
                  {['Q3 Revenue Report', 'Marketing Workflow', 'Team Standup Notes'].map(page => (
                    <Command.Item
                      key={page}
                      value={page}
                      onSelect={() => navigate('/documents')}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-muted cursor-pointer data-[selected=true]:bg-accent/10 data-[selected=true]:text-accent transition-colors"
                    >
                      <Clock size={18} /> {page}
                    </Command.Item>
                  ))}
                </Command.Group>
              </Command.List>
            </Command>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
