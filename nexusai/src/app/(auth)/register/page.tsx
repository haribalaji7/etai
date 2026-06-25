'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { User, Mail, Lock, ChevronRight } from 'lucide-react';

const step1Schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] });

type Step1Data = z.infer<typeof step1Schema>;

const roles = [
  { id: 'engineering', label: 'Engineering', icon: '💻' },
  { id: 'product', label: 'Product', icon: '📋' },
  { id: 'design', label: 'Design', icon: '🎨' },
  { id: 'marketing', label: 'Marketing', icon: '📢' },
  { id: 'sales', label: 'Sales', icon: '💼' },
  { id: 'hr', label: 'Human Resources', icon: '👥' },
  { id: 'finance', label: 'Finance', icon: '💰' },
  { id: 'executive', label: 'Executive', icon: '👔' },
];

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
  });

  const onStep1 = () => { setStep(2); };
  const onStep2 = async () => {
    if (!selectedRole) { toast.error('Please select a role'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    toast.success('Account created successfully!');
    setLoading(false);
    window.location.href = '/admin';
  };

  return (
    <div className="min-h-screen flex items-center justify-center aurora p-6">
      <motion.div className="glass p-8 sm:p-10 w-full max-w-lg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-center mb-6">
          <Link href="/" className="text-2xl font-bold gradient-text">NexusAI</Link>
          <h1 className="text-2xl font-bold mt-4 mb-2">Create Account</h1>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2].map(s => (
            <div key={s} className="flex-1 h-1.5 rounded-full overflow-hidden bg-surface">
              <motion.div
                className="h-full bg-accent rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: step >= s ? '100%' : '0%' }}
                transition={{ duration: 0.4 }}
              />
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.form key="step1" onSubmit={handleSubmit(onStep1)} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <div>
                <label className="text-sm text-text-muted mb-1.5 block">Full Name</label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input {...register('name')} placeholder="John Doe" className="w-full bg-surface border border-border rounded-xl py-3 pl-10 pr-4 text-sm" />
                </div>
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="text-sm text-text-muted mb-1.5 block">Email</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input {...register('email')} type="email" placeholder="you@company.com" className="w-full bg-surface border border-border rounded-xl py-3 pl-10 pr-4 text-sm" />
                </div>
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className="text-sm text-text-muted mb-1.5 block">Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input {...register('password')} type="password" placeholder="••••••••" className="w-full bg-surface border border-border rounded-xl py-3 pl-10 pr-4 text-sm" />
                </div>
                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
              </div>
              <div>
                <label className="text-sm text-text-muted mb-1.5 block">Confirm Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input {...register('confirmPassword')} type="password" placeholder="••••••••" className="w-full bg-surface border border-border rounded-xl py-3 pl-10 pr-4 text-sm" />
                </div>
                {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>}
              </div>
              <motion.button type="submit" whileTap={{ scale: 0.96 }} className="w-full bg-accent text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2">
                Continue <ChevronRight size={18} />
              </motion.button>
            </motion.form>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <p className="text-sm text-text-muted mb-4">Select your primary role</p>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {roles.map(role => (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`glass p-4 !rounded-xl text-left transition-all ${selectedRole === role.id ? 'accent-ring' : 'hover:!bg-white/5'}`}
                  >
                    <span className="text-2xl mb-2 block">{role.icon}</span>
                    <span className="text-sm font-medium">{role.label}</span>
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="glass !bg-white/5 flex-1 py-3 !rounded-xl text-sm font-medium">Back</button>
                <motion.button
                  onClick={onStep2}
                  disabled={loading}
                  whileTap={{ scale: 0.96 }}
                  className="bg-accent text-white flex-1 py-3 rounded-xl text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading && <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
                  {loading ? 'Creating account...' : 'Create Account'}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-center text-sm text-text-muted mt-6">
          Already have an account? <Link href="/login" className="text-accent hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
