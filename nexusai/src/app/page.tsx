'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedCounter, GlassCard } from '@/components/ui/shared';
import { aiAgents, faqItems } from '@/lib/data';
import { ChevronDown, Check, Star, ArrowRight, Zap, BarChart3, GitBranch, Shield, Globe, Users } from 'lucide-react';

const DynamicGlobe = dynamic(() => import('@/components/three/scenes').then(m => {
  const { NeuralGlobe, Scene3D } = m;
  return function GlobeScene() {
    return (
      <Scene3D className="!absolute inset-0 w-full h-full">
        <NeuralGlobe />
      </Scene3D>
    );
  };
}), { ssr: false, loading: () => <div className="w-full h-full skeleton rounded-2xl" /> });

const ease = [0.16, 1, 0.3, 1];

const features = [
  { title: 'AI Orchestration', desc: 'Route tasks to 15 specialized AI agents that collaborate autonomously to solve complex problems.', shape: 'torus', color: '#7c3aed' },
  { title: 'Smart Analytics', desc: 'Real-time dashboards with AI-powered insights that predict trends before they happen.', shape: 'octahedron', color: '#06b6d4' },
  { title: 'Workflow Engine', desc: 'Visual drag-and-drop builder with conditional logic, approvals, and AI decision nodes.', shape: 'box', color: '#10b981' },
  { title: 'Enterprise Security', desc: 'SOC 2 Type II compliant with end-to-end encryption and role-based access control.', shape: 'icosahedron', color: '#f59e0b' },
  { title: 'Global Scale', desc: 'Process millions of tasks across distributed systems with 99.9% uptime guarantee.', shape: 'dodecahedron', color: '#ec4899' },
  { title: 'Team Collaboration', desc: 'Real-time collaboration with AI-powered project management and resource allocation.', shape: 'cone', color: '#8b5cf6' },
];

const featureIcons = [Zap, BarChart3, GitBranch, Shield, Globe, Users];

const pricing = [
  { name: 'Starter', price: 49, period: '/mo', features: ['3 AI Agents', '100 Workflows/mo', '5 Team Members', 'Basic Analytics', 'Email Support', 'API Access'], popular: false },
  { name: 'Professional', price: 149, period: '/mo', features: ['10 AI Agents', 'Unlimited Workflows', '25 Team Members', 'Advanced Analytics', 'Priority Support', 'Custom Integrations', 'SSO & RBAC', 'Audit Logs'], popular: true },
  { name: 'Enterprise', price: 499, period: '/mo', features: ['15 AI Agents', 'Unlimited Everything', 'Unlimited Members', 'AI Custom Training', 'Dedicated Support', 'On-Premise Option', 'SLA 99.99%', 'White Label', 'Custom Models'], popular: false },
];

const logos = ['Acme Corp', 'TechNova', 'DataFlow', 'CloudSync', 'CyberEdge', 'QuantumAI', 'NeoSoft', 'Vertex Labs'];

const testimonials = [
  { name: 'Sarah Chen', role: 'VP Engineering, TechNova', quote: 'NexusAI reduced our workflow processing time by 85%. The AI agents handle tasks that used to take our team days.', rating: 5 },
  { name: 'Michael Torres', role: 'CTO, DataFlow Inc', quote: 'The most impressive AI platform we\'ve deployed. The orchestrator agent intelligently routes tasks across our entire organization.', rating: 5 },
  { name: 'Emily Watson', role: 'COO, CloudSync', quote: 'We automated 90% of our compliance workflows. NexusAI pays for itself within the first month of deployment.', rating: 5 },
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const headline = 'The AI Brain Your Enterprise Needs'.split(' ');

  return (
    <div className="aurora min-h-screen relative">
      {/* NAV */}
      <nav className="fixed top-0 w-full z-50 glass !rounded-none !border-x-0 !border-t-0 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold gradient-text">NX</span>
            <span className="text-lg font-semibold text-text-primary hidden sm:block">NexusAI</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-text-muted">
            <a href="#features" className="hover:text-text-primary transition-colors">Features</a>
            <a href="#agents" className="hover:text-text-primary transition-colors">AI Agents</a>
            <a href="#pricing" className="hover:text-text-primary transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-text-primary transition-colors">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-text-muted hover:text-text-primary transition-colors px-4 py-2">Sign In</Link>
            <Link href="/register" className="shimmer-btn bg-accent hover:bg-accent/90 text-white text-sm font-medium px-5 py-2 rounded-xl transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center pt-20">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center w-full">
          <div className="z-10">
            <motion.h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              {headline.map((word, i) => (
                <motion.span
                  key={i}
                  className={i >= 3 ? 'gradient-text' : ''}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.6, ease }}
                >
                  {word}{' '}
                </motion.span>
              ))}
            </motion.h1>
            <motion.p
              className="text-lg text-text-muted mb-8 max-w-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Harness 15 autonomous AI agents that collaborate, analyze, and execute — transforming your enterprise workflows with unprecedented intelligence.
            </motion.p>
            <motion.div
              className="flex flex-wrap gap-4 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5, ease }}
            >
              <Link href="/register" className="shimmer-btn bg-accent hover:bg-accent/90 text-white font-semibold px-8 py-3.5 rounded-xl transition-all flex items-center gap-2">
                Start Free Trial <ArrowRight size={18} />
              </Link>
              <Link href="#features" className="glass !bg-white/5 hover:!bg-white/10 text-text-primary font-semibold px-8 py-3.5 !rounded-xl transition-all hover:glow-border">
                Watch Demo
              </Link>
            </motion.div>
            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              {[
                { label: 'AI Agents', value: 15 },
                { label: 'Uptime', value: 99.9, suffix: '%', decimals: 1 },
                { label: 'Faster', value: 10, suffix: 'x' },
              ].map((stat, i) => (
                <div key={i} className={`glass p-4 px-6 ${['animate-float', 'animate-float-delayed', 'animate-float-slow'][i]}`}>
                  <div className="text-2xl font-bold gradient-text">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} decimals={stat.decimals} />
                  </div>
                  <div className="text-xs text-text-muted mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
          <motion.div
            className="relative h-[400px] lg:h-[500px]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8, ease }}
          >
            <DynamicGlobe />
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything Your Enterprise <span className="gradient-text">Needs</span>
            </h2>
            <p className="text-text-muted max-w-2xl mx-auto">Powered by cutting-edge AI, NexusAI provides a comprehensive suite of tools to transform your business operations.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const Icon = featureIcons[i];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.5, ease }}
                >
                  <GlassCard className="p-6 h-full" hover>
                    <div className="border-t-2 -mt-6 -mx-6 mb-6 rounded-t-2xl" style={{ borderColor: f.color }} />
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 flex-shrink-0 rounded-xl flex items-center justify-center" style={{ background: `${f.color}20` }}>
                        <Icon size={28} style={{ color: f.color }} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                        <p className="text-sm text-text-muted leading-relaxed">{f.desc}</p>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* AI AGENTS */}
      <section id="agents" className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="gradient-text">15 AI Agents</span> Working in Harmony
            </h2>
            <p className="text-text-muted max-w-2xl mx-auto">Each agent is specialized for a unique domain, orchestrated by a central intelligence that routes tasks intelligently.</p>
          </motion.div>
          <div className="relative mx-auto" style={{ maxWidth: 600, height: 600 }}>
            <svg viewBox="0 0 600 600" className="w-full h-full">
              {/* Connections */}
              {aiAgents.slice(1).map((agent, i) => {
                const angle = ((i) / 14) * Math.PI * 2 - Math.PI / 2;
                const x = 300 + Math.cos(angle) * 220;
                const y = 300 + Math.sin(angle) * 220;
                return (
                  <line key={`line-${agent.id}`} x1="300" y1="300" x2={x} y2={y}
                    stroke={agent.color} strokeWidth="1" opacity="0.3"
                    strokeDasharray="4 4" className="animate-dash-flow" />
                );
              })}
              {/* Center Orchestrator */}
              <circle cx="300" cy="300" r="45" fill="rgba(124,58,237,0.2)" stroke="#7c3aed" strokeWidth="2">
                <animate attributeName="r" values="45;50;45" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx="300" cy="300" r="55" fill="none" stroke="#7c3aed" strokeWidth="1" opacity="0.3">
                <animate attributeName="r" values="55;65;55" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.3;0.1;0.3" dur="2s" repeatCount="indefinite" />
              </circle>
              <text x="300" y="295" textAnchor="middle" fill="white" fontSize="20">🧠</text>
              <text x="300" y="318" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Orchestrator</text>
              {/* Agent nodes */}
              {aiAgents.slice(1).map((agent, i) => {
                const angle = ((i) / 14) * Math.PI * 2 - Math.PI / 2;
                const x = 300 + Math.cos(angle) * 220;
                const y = 300 + Math.sin(angle) * 220;
                return (
                  <g key={agent.id}>
                    <circle cx={x} cy={y} r="28" fill={`${agent.color}20`} stroke={agent.color} strokeWidth="1.5" />
                    <text x={x} y={y - 2} textAnchor="middle" fontSize="14">{agent.icon}</text>
                    <text x={x} y={y + 14} textAnchor="middle" fill="white" fontSize="7" fontWeight="500">{agent.name}</text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="py-16 relative z-10 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...logos, ...logos].map((logo, i) => (
            <div key={i} className="mx-8 flex-shrink-0 glass px-8 py-4 !rounded-xl">
              <span className="text-text-muted font-semibold text-lg">{logo}</span>
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-16 grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <GlassCard className="p-6">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => <Star key={j} size={16} className="text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-sm text-text-muted mb-4 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-sm">
                    {t.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs text-text-muted">{t.role}</div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Simple, <span className="gradient-text">Transparent</span> Pricing</h2>
            <p className="text-text-muted">Start free, scale as you grow. No hidden fees.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-end">
            {pricing.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={plan.popular ? 'lg:-mt-4' : ''}
              >
                <div className={`glass p-8 relative ${plan.popular ? 'glow-border' : ''}`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white text-xs font-bold px-4 py-1 rounded-full">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="text-text-muted">{plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-text-muted">
                        <Check size={16} className="text-emerald-400 flex-shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/register"
                    className={`block text-center py-3 rounded-xl font-semibold transition-all ${plan.popular ? 'bg-accent hover:bg-accent/90 text-white' : 'glass !bg-white/5 hover:!bg-white/10 text-text-primary'}`}
                  >
                    Get Started
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 relative z-10">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Frequently Asked <span className="gradient-text">Questions</span></h2>
          </motion.div>
          <div className="space-y-3">
            {faqItems.map((faq, i) => (
              <motion.div key={i} className="glass overflow-hidden" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <button
                  className="w-full flex items-center justify-between p-5 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-semibold">{faq.q}</span>
                  <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={20} className="text-text-muted" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease }}
                    >
                      <p className="px-5 pb-5 text-sm text-text-muted leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <span className="text-xl font-bold gradient-text mb-4 block">NexusAI</span>
            <p className="text-sm text-text-muted">The AI brain your enterprise needs. Automating workflows with intelligence.</p>
          </div>
          {[
            { title: 'Product', links: ['Features', 'Pricing', 'Integrations', 'Changelog'] },
            { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
            { title: 'Legal', links: ['Privacy', 'Terms', 'Security', 'GDPR'] },
          ].map((col, i) => (
            <div key={i}>
              <h4 className="font-semibold mb-4 text-sm">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link, j) => (
                  <li key={j}><a href="#" className="text-sm text-text-muted hover:text-text-primary transition-colors">{link}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted">&copy; 2024 NexusAI. All rights reserved.</p>
          <div className="flex gap-4">
            {['Twitter', 'GitHub', 'LinkedIn', 'Discord'].map((s) => (
              <a key={s} href="#" className="text-xs text-text-muted hover:text-text-primary transition-colors">{s}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
