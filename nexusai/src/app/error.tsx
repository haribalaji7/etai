'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { RippleButton } from '@/components/ui/shared';

const DynamicOrbs = dynamic(() => import('@/components/three/scenes').then(m => {
  const { FloatingOrbs, Scene3D } = m;
  return function OrbScene() {
    return (
      <div className="w-full h-64 relative">
        <Scene3D className="!absolute inset-0 w-full h-full">
          <FloatingOrbs />
        </Scene3D>
      </div>
    );
  };
}), { ssr: false, loading: () => <div className="w-full h-64 skeleton rounded-2xl" /> });

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base aurora p-6 text-center space-y-6">
      <div className="relative z-10 max-w-md space-y-4">
        {/* Three.js animated scene */}
        <DynamicOrbs />

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-7xl font-bold font-mono tracking-widest text-accent"
        >
          500
        </motion.h1>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl font-bold text-text-primary"
        >
          Internal Server Error
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xs text-text-muted leading-relaxed"
        >
          An unexpected error occurred in our system node. Please try reloading the path or contact support.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="pt-4 flex gap-4 justify-center"
        >
          <RippleButton onClick={() => reset()} className="bg-accent hover:bg-accent/90 text-white font-semibold px-6 py-2.5 rounded-xl text-xs">
            Reload Path
          </RippleButton>
          <Link href="/">
            <RippleButton className="glass !bg-white/5 hover:!bg-white/10 text-text-primary font-semibold px-6 py-2.5 !rounded-xl text-xs">
              Return Home
            </RippleButton>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
