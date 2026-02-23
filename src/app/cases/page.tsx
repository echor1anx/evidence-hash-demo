"use client";

import { useAuth } from "@/context/AuthContext";
import { FolderOpen, Plus, ShieldCheck, Clock, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Mock Data for the prototype
const MOCK_CASES = [
  {
    id: "CAS-2026-8921",
    type: "Criminal",
    title: "State vs. DOE - Financial Fraud",
    date: "2026-02-15",
    evidenceCount: 14,
    status: "Active Investigation",
    lead: "Det. Sarah Jenkins",
  },
  {
    id: "CAS-2026-8944",
    type: "Civil",
    title: "Smith Property Dispute",
    date: "2026-02-18",
    evidenceCount: 3,
    status: "Pending Court",
    lead: "Inv. Marcus Thorne",
  },
  {
    id: "CAS-2026-8950",
    type: "Criminal",
    title: "Operation Nightfall",
    date: "2026-02-20",
    evidenceCount: 42,
    status: "Evidence Collection",
    lead: "James T. Kirk",
  }
];

export default function CasesDashboard() {
  const { user } = useAuth();
  const router = useRouter();

  // Protect route
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) return null;

  // RBAC check
  const canCreateCase = user.role === "Investigator" || user.role === "Admin";

  return (
    <div className="min-h-screen bg-[#020617] pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
              <FolderOpen className="text-blue-500" size={32} />
              Active Ledgers
            </h1>
            <p className="text-slate-400 mt-2">Manage and audit cryptographic case files.</p>
          </div>

          {canCreateCase && (
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] flex items-center gap-2">
              <Plus size={20} />
              Open New Case
            </button>
          )}
        </div>

        {/* System Stats (Visual Flair) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
           <StatCard icon={<ShieldCheck size={20}/>} title="Network Integrity" value="100% Secured" color="text-green-400" />
           <StatCard icon={<Clock size={20}/>} title="Last Block Sync" value="2 mins ago" color="text-blue-400" />
           <StatCard icon={<CheckCircle2 size={20}/>} title="Verified Evidence" value="1,492 Hashes" color="text-purple-400" />
        </div>

        {/* Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_CASES.map((c) => (
            <Link href={`/cases/${c.id}`} key={c.id} className="block group">
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 hover:bg-white/[0.04] hover:border-blue-500/30 transition-all h-full flex flex-col relative overflow-hidden">
                
                {/* Decorative glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-600/10 transition-colors" />

                <div className="flex justify-between items-start mb-4 relative z-10">
                  <span className="px-3 py-1 bg-blue-900/30 text-blue-400 text-xs font-bold rounded-lg uppercase tracking-wider border border-blue-500/20">
                    {c.type}
                  </span>
                  <span className="text-xs font-mono text-slate-500">{c.id}</span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 relative z-10 group-hover:text-blue-400 transition-colors">{c.title}</h3>
                
                <div className="flex-grow">
                  <p className="text-sm text-slate-400 mb-1">Lead: <span className="text-slate-300">{c.lead}</span></p>
                  <p className="text-sm text-slate-400">Status: <span className="text-slate-300">{c.status}</span></p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center relative z-10">
                  <span className="text-xs text-slate-500">{c.date}</span>
                  <span className="flex items-center gap-1 text-sm font-semibold text-slate-300">
                    <FolderOpen size={14} className="text-blue-500" />
                    {c.evidenceCount} Items
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}

function StatCard({ icon, title, value, color }: any) {
  return (
    <div className="bg-[#0f172a] border border-white/5 rounded-2xl p-6 flex items-center gap-4">
      <div className={`p-3 rounded-xl bg-white/5 ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{title}</p>
        <p className={`text-lg font-mono font-bold mt-1 ${color}`}>{value}</p>
      </div>
    </div>
  );
}
