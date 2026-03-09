"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/AuthLayout';
import Link from 'next/link';
import { User, Mail, Lock, Building, Layers, BadgeCheck, Shield, AlertCircle, CheckCircle2 } from 'lucide-react';
import { UserRole } from '@/context/AuthContext';

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [organization, setOrganization] = useState('');
  const [department, setDepartment] = useState('');
  const [role, setRole] = useState<UserRole>('Investigator');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          organization,
          department,
          designation: 'Officer'
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setSuccess('Your request has been sent to the admin. You will be able to log in once approved.');

      // Optionally redirect after a few seconds
      setTimeout(() => {
        router.push('/login');
      }, 5000);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Personnel Enrollment" description="Fill in your details to request access to the ledger.">

      {success ? (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-4 mb-6">
          <CheckCircle2 size={48} className="text-green-500" />
          <div>
            <h3 className="text-lg font-bold mb-1">Request Submitted</h3>
            <p className="text-sm opacity-90">{success}</p>
          </div>
          <Link href="/login" className="mt-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 px-6 py-2 rounded-xl transition-colors text-sm font-semibold">
            Return to Login
          </Link>
        </div>
      ) : (
        <form className="space-y-6" onSubmit={handleRegister}>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-start gap-3 text-sm">
              <AlertCircle className="shrink-0 mt-0.5" size={16} />
              <p>{error}</p>
            </div>
          )}

          {/* Full Name & Email */}
          <div className="grid grid-cols-1 gap-4">
            <InputGroup label="Full Name" icon={<User size={18} />} placeholder="James T. Kirk" value={name} onChange={(e: any) => setName(e.target.value)} required />
            <InputGroup label="Official Email ID" icon={<Mail size={18} />} placeholder="kirk@starfleet.gov" type="email" value={email} onChange={(e: any) => setEmail(e.target.value)} required />
            <InputGroup label="Master Password" icon={<Lock size={18} />} placeholder="Minimum 8 chars" type="password" value={password} onChange={(e: any) => setPassword(e.target.value)} required />
          </div>

          {/* Role Selection (Crucial for RBAC) */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Assigned Role</label>
            <div className="grid grid-cols-2 gap-3">
              {(['Investigator', 'Custodian', 'Analyst', 'Auditor', 'Admin'] as UserRole[]).map((r) => r && (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 border transition-all ${role === r
                      ? 'bg-blue-600/20 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.2)]'
                      : 'bg-white/[0.02] border-white/5 text-slate-400 hover:bg-white/[0.05]'
                    }`}
                >
                  {r === 'Investigator' && <Shield size={16} />}
                  {r === 'Custodian' && <Lock size={16} />}
                  {r === 'Analyst' && <Layers size={16} />}
                  {r === 'Auditor' && <BadgeCheck size={16} />}
                  {r === 'Admin' && <AlertCircle size={16} />}
                  {r}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-2 ml-1">Role determines blockchain smart contract permissions. (Admin added for testing)</p>
          </div>

          {/* Professional Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <InputGroup label="Organization" icon={<Building size={16} />} placeholder="State Police" value={organization} onChange={(e: any) => setOrganization(e.target.value)} required />
            <InputGroup label="Department" icon={<Layers size={16} />} placeholder="Forensics" value={department} onChange={(e: any) => setDepartment(e.target.value)} required />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-500 transition-all shadow-[0_10px_20px_-5px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Submitting Request...' : 'Request for Access'}
            </button>
          </div>
        </form>
      )}

      {!success && (
        <p className="mt-8 text-center text-sm text-slate-500">
          Existing Officer? <Link href="/login" className="text-blue-400 font-bold hover:underline">Return to Login</Link>
        </p>
      )}
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