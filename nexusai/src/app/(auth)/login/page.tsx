'use client';

import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

const DynamicOrbs = dynamic(() => import('@/components/three/scenes').then(m => {
  const { FloatingOrbs, Scene3D } = m;
  return function OrbScene() {
    return (
      <Scene3D className="!absolute inset-0 w-full h-full opacity-60">
        <FloatingOrbs />
      </Scene3D>
    );
  };
}), { ssr: false, loading: () => <div className="w-full h-full skeleton" /> });

const loginSchema = z.object({
  email: z.string().optional(),
  password: z.string().optional(),
  remember: z.boolean().optional(),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    toast.success(`Welcome back! Signed in as ${data.email}`);
    setLoading(false);
    window.location.href = '/admin';
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - 3D */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-surface items-center justify-center overflow-hidden">
        <DynamicOrbs />
        <div className="relative z-10 text-center p-12">
          <h2 className="text-3xl font-bold gradient-text mb-4">Welcome Back</h2>
          <p className="text-text-muted max-w-sm mx-auto">Sign in to access your AI-powered enterprise dashboard and manage your workflows.</p>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-6 aurora">
        <motion.div
          className="glass p-8 sm:p-10 w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <Link href="/" className="text-2xl font-bold gradient-text">NexusAI</Link>
            <h1 className="text-2xl font-bold mt-4 mb-2">Sign In</h1>
            <p className="text-sm text-text-muted">Enter your credentials to continue</p>
          </div>

          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
            animate={Object.keys(errors).length > 0 ? { x: [0, 10, -10, 0] } : {}}
            transition={{ duration: 0.3 }}
          >
            <div>
              <label className="text-sm text-text-muted mb-1.5 block">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="you@company.com"
                  className="w-full bg-surface border border-border rounded-xl py-3 pl-10 pr-4 text-sm focus:border-accent transition-colors"
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="text-sm text-text-muted mb-1.5 block">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full bg-surface border border-border rounded-xl py-3 pl-10 pr-10 text-sm focus:border-accent transition-colors"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <div className="relative">
                  <input {...register('remember')} type="checkbox" className="sr-only peer" />
                  <div className="w-9 h-5 bg-surface border border-border rounded-full peer-checked:bg-accent transition-colors" />
                  <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4" />
                </div>
                <span className="text-sm text-text-muted">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-sm text-accent hover:underline">Forgot password?</Link>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.96 }}
              className="w-full bg-accent hover:bg-accent/90 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {loading ? 'Signing in...' : 'Sign In'}
            </motion.button>
          </motion.form>

          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-text-muted">or continue with</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { name: 'Google', icon: '🔵' },
              { name: 'GitHub', icon: '⚫' },
            ].map((provider) => (
              <button key={provider.name} className="glass !bg-white/5 hover:!bg-white/10 py-3 !rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2">
                <span>{provider.icon}</span> {provider.name}
              </button>
            ))}
          </div>

          <p className="text-center text-sm text-text-muted mt-6">
            Don&apos;t have an account? <Link href="/register" className="text-accent hover:underline">Sign up</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
