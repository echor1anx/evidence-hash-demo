// components/AuthLayout.tsx
import { Shield, Lock /*, activity*/ } from 'lucide-react';

export default function AuthLayout({ children, title, description }: { children: React.ReactNode, title: string, description: string }) {
  return (
    <div className="min-h-screen bg-[#020617] flex font-sans text-slate-200">
      {/* Visual Side (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-16 overflow-hidden border-r border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/5" />
        {/* Animated Grid Background */}
        <div className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] [background-size:40px_40px]" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)]">
              <Shield className="text-white" size={24} />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white italic">CUSTODY<span className="text-blue-500 text-sm">.chain</span></span>
          </div>
          <h1 className="text-5xl font-extrabold text-white leading-[1.1] mb-6">
            Digital Evidence <br/><span className="text-blue-500">Immutable Vault.</span>
          </h1>
          <p className="max-w-md text-slate-400 text-lg">
            A blockchain-backed environment ensuring that every piece of evidence remains untampered and verifiable.
          </p>
        </div>

        <div className="relative z-10 flex gap-8">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-1">Network Status</span>
            <span className="text-green-400 font-mono text-xs flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" /> 0.4ms Latency
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-1">Hash Protocol</span>
            <span className="text-slate-300 font-mono text-xs uppercase">SHA-256 / SHA-3</span>
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-24 py-12 bg-[#020617]">
        <div className="max-w-md w-full mx-auto">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
            <p className="text-slate-400">{description}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}