"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/AuthLayout';
import Link from 'next/link';
import { Mail, KeyRound, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      setUser(data.user);
      router.push('/dashboard');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Identity Verification" description="Please enter your secure credentials to proceed.">
      <form className="space-y-6" onSubmit={handleLogin}>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-start gap-3 text-sm">
            <AlertCircle className="shrink-0 mt-0.5" size={16} />
            <p>{error}</p>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-widest text-slate-500 ml-1">Email ID</label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="officer@agency.gov"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:bg-white/10 transition-all placeholder:text-slate-600"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-widest text-slate-500 ml-1">Access Key</label>
          <div className="relative group">
            <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:bg-white/10 transition-all placeholder:text-slate-600"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-white text-black font-bold py-4 rounded-2xl hover:bg-blue-500 hover:text-white transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:opacity-50 disabled:transform-none"
        >
          {loading ? 'Authenticating...' : 'Authenticate Access'}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-500">
        Unauthorized? <Link href="/register" className="text-blue-400 font-bold hover:underline">Request Enrollment</Link>
      </p>
    </AuthLayout>
  );
}

/*
version 2 - Combined Login/Register page with animated transitions and enhanced UI using Framer Motion and Lucide icons.
"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Lock, Mail, User, Building2, Briefcase, ChevronRight, Fingerprint } from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[1000px] grid md:grid-cols-2 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
      >
        <div className="hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-blue-600/20 to-transparent border-r border-white/5">
          <div>
            <div className="flex items-center gap-2 mb-8">
              <div className="p-2 bg-blue-600 rounded-lg">
                <ShieldCheck className="text-white w-6 h-6" />
              </div>
              <span className="text-white font-bold text-xl tracking-tight">E-LOCKER</span>
            </div>
            <h1 className="text-4xl font-extrabold text-white leading-tight">
              Immutable <span className="text-blue-400 font-mono tracking-tighter">Chain-of-Custody</span> Assurance.
            </h1>
            <p className="mt-6 text-slate-400 leading-relaxed">
              Securing digital evidence through decentralized verification. Every access, every edit, permanently etched in the ledger.
            </p>
          </div>
          
          <div className="flex items-center gap-4 text-xs text-slate-500 font-mono">
            <div className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            NODE STATUS: OPERATIONAL // BLOCK 742,109
          </div>
        </div>

        <div className="p-8 md:p-12 relative">
          <AnimatePresence mode="wait">
            {isLogin ? (
              <AuthSection 
                key="login"
                title="Personnel Login" 
                subtitle="Enter your credentials to access the vault"
                buttonText="Authorize Access"
                onToggle={() => setIsLogin(false)}
                isLogin={true}
              />
            ) : (
              <AuthSection 
                key="register"
                title="Request Credentials" 
                subtitle="Apply for a new digital identity on the chain"
                buttonText="Request for Access"
                onToggle={() => setIsLogin(true)}
                isLogin={false}
              />
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

function AuthSection({ title, subtitle, buttonText, onToggle, isLogin }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
      <p className="text-slate-400 text-sm mb-8">{subtitle}</p>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        {!isLogin && (
          <InputField icon={<User size={18}/>} label="Full Name" type="text" placeholder="John Doe" />
        )}
        
        <InputField icon={<Mail size={18}/>} label="Official Email ID" type="email" placeholder="officer@dept.gov" />
        <InputField icon={<Lock size={18}/>} label="Password" type="password" placeholder="••••••••" />

        {!isLogin && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <InputField icon={<Building2 size={18}/>} label="Organization" type="text" placeholder="Interpol" />
              <InputField icon={<Fingerprint size={18}/>} label="Department" type="text" placeholder="Cyber" />
            </div>
            <InputField icon={<Briefcase size={18}/>} label="Designation" type="text" placeholder="Lead Investigator" />
          </>
        )}

        <button className="group w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 mt-8 shadow-[0_0_20px_rgba(37,99,235,0.3)]">
          {buttonText}
          <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-500">
        {isLogin ? "Authorized personnel only." : "Application requires admin verification."}{" "}
        <button onClick={onToggle} className="text-blue-400 hover:text-blue-300 font-semibold underline underline-offset-4">
          {isLogin ? "Register Access" : "Back to Login"}
        </button>
      </p>
    </motion.div>
  );
}

function InputField({ label, type, placeholder, icon }: any) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] uppercase tracking-widest font-bold text-slate-500 ml-1">{label}</label>
      <div className="relative group">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors">
          {icon}
        </div>
        <input 
          type={type}
          placeholder={placeholder}
          className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
        />
      </div>
    </div>
  );
}
*/
/* version 1 - Separate Login and Register pages with basic forms and links to switch between them.
"use client";
import React from 'react';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="max-w-md w-full p-8 bg-white shadow-lg rounded-xl border border-slate-200">
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">Evidence Locker</h2>
        <p className="text-sm text-center text-slate-500 mb-8">Secure Chain-of-Custody Portal</p>
        
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Email Address</label>
            <input type="email" placeholder="name@org.gov" className="w-full p-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <input type="password" placeholder="••••••••" className="w-full p-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none" required />
          </div>
          <button className="w-full bg-slate-900 text-white py-2 rounded-md hover:bg-slate-800 transition-colors font-semibold">
            Login
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm text-slate-600">
          New officer? <a href="/register" className="text-blue-600 hover:underline">Register for access</a>
        </p>
      </div>
    </div>
  );
}
*/



