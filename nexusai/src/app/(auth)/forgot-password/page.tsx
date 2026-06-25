'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Mail, ArrowLeft } from 'lucide-react';

const schema = z.object({ email: z.string().email('Please enter a valid email') });
type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (_data: FormData) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    toast.success('Reset link sent!');
    setSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center aurora p-6">
      <motion.div className="glass p-8 sm:p-10 w-full max-w-md" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold gradient-text">NexusAI</Link>
          <h1 className="text-2xl font-bold mt-4 mb-2">Reset Password</h1>
          <p className="text-sm text-text-muted">Enter your email and we&apos;ll send you a reset link</p>
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="text-sm text-text-muted mb-1.5 block">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input {...register('email')} type="email" placeholder="you@company.com" className="w-full bg-surface border border-border rounded-xl py-3 pl-10 pr-4 text-sm" />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <motion.button type="submit" disabled={loading} whileTap={{ scale: 0.96 }} className="w-full bg-accent text-white font-semibold py-3 rounded-xl disabled:opacity-50 flex items-center justify-center gap-2">
              {loading && <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
              {loading ? 'Sending...' : 'Send Reset Link'}
            </motion.button>
          </form>
        ) : (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">📬</div>
            <h3 className="text-lg font-semibold mb-2">Check your inbox</h3>
            <p className="text-sm text-text-muted mb-6">We&apos;ve sent a password reset link to your email address.</p>
            <button onClick={() => setSent(false)} className="text-accent text-sm hover:underline">Didn&apos;t receive it? Try again</button>
          </div>
        )}

        <Link href="/login" className="flex items-center justify-center gap-2 text-sm text-text-muted hover:text-text-primary mt-6 transition-colors">
          <ArrowLeft size={16} /> Back to sign in
        </Link>
      </motion.div>
    </div>
  );
}
