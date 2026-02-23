"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/AuthLayout';
import Link from 'next/link';
import { User, Mail, Lock, Building, Layers, BadgeCheck, Shield } from 'lucide-react';
import { useAuth, UserRole } from '@/context/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('Investigator');
  const [loading, setLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Mock registration delay
    setTimeout(() => {
      login(email || "officer@state.gov", role, name || "New Officer");
      router.push('/cases'); // Redirect to dashboard after login
    }, 1000);
  };

  return (
    <AuthLayout title="Personnel Enrollment" description="Fill in your details to request access to the ledger.">
      <form className="space-y-6" onSubmit={handleRegister}>
        {/* Full Name & Email */}
        <div className="grid grid-cols-1 gap-4">
          <InputGroup label="Full Name" icon={<User size={18}/>} placeholder="James T. Kirk" value={name} onChange={(e: any) => setName(e.target.value)} />
          <InputGroup label="Official Email ID" icon={<Mail size={18}/>} placeholder="kirk@starfleet.gov" type="email" value={email} onChange={(e: any) => setEmail(e.target.value)} required />
          <InputGroup label="Master Password" icon={<Lock size={18}/>} placeholder="Minimum 12 chars" type="password" required />
        </div>

        {/* Role Selection (Crucial for RBAC) */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Assigned Role</label>
          <div className="grid grid-cols-2 gap-3">
            {(['Investigator', 'Custodian', 'Analyst', 'Auditor'] as UserRole[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 border transition-all ${
                  role === r 
                    ? 'bg-blue-600/20 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.2)]' 
                    : 'bg-white/[0.02] border-white/5 text-slate-400 hover:bg-white/[0.05]'
                }`}
              >
                {r === 'Investigator' && <Shield size={16} />}
                {r === 'Custodian' && <Lock size={16} />}
                {r === 'Analyst' && <Layers size={16} />}
                {r === 'Auditor' && <BadgeCheck size={16} />}
                {r}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-2 ml-1">Role determines blockchain smart contract permissions.</p>
        </div>

        {/* Professional Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          <InputGroup label="Organization" icon={<Building size={16}/>} placeholder="State Police" />
          <InputGroup label="Department" icon={<Layers size={16}/>} placeholder="Forensics" />
        </div>
        
        <div className="pt-2">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-500 transition-all shadow-[0_10px_20px_-5px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Enrolling on Blockchain...' : 'Request for Access'}
          </button>
        </div>
      </form>

      <p className="mt-8 text-center text-sm text-slate-500">
        Existing Officer? <Link href="/login" className="text-blue-400 font-bold hover:underline">Return to Login</Link>
      </p>
    </AuthLayout>
  );
}

// Helper Component for Inputs
function InputGroup({ label, icon, placeholder, type = "text", value, onChange, required = false }: any) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">{label} {required && '*'}</label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors">
          {icon}
        </div>
        <input 
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all placeholder:text-slate-700" 
        />
      </div>
    </div>
  );
}

/* app/register/page.tsx
"use client";
import React from 'react';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12">
      <div className="max-w-lg w-full p-8 bg-white shadow-lg rounded-xl border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-1">Access Request</h2>
        <p className="text-sm text-slate-500 mb-8">Register your credentials for the blockchain evidence audit trail.</p>
        
        <form className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Full Name</label>
              <input type="text" className="w-full p-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Official Email ID</label>
              <input type="email" className="w-full p-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <input type="password" title="Minimum 8 characters" className="w-full p-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none" required />
            </div>
            
            <hr className="my-2 border-slate-100" />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Organization</label>
                <input type="text" placeholder="e.g. FBI, Police" className="w-full p-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Department</label>
                <input type="text" placeholder="e.g. Cyber Cell" className="w-full p-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none" required />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700">Designation</label>
              <input type="text" placeholder="e.g. Senior Investigator" className="w-full p-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none" required />
            </div>
          </div>

          <button className="w-full mt-6 bg-blue-700 text-white py-3 rounded-md hover:bg-blue-800 transition-all font-bold shadow-md">
            Request for Access
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm text-slate-600">
          Already have access? <a href="/login" className="text-blue-600 hover:underline">Sign in</a>
        </p>
      </div>
    </div>
  );
}
*/