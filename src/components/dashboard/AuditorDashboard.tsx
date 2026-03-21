"use client";

import { useState } from "react";
import Link from "next/link";
import { ICase } from "@/models/Case";
import { User } from "@/context/AuthContext";
import { ArrowRight, Search, Clock, ShieldCheck, CheckSquare, ActivitySquare } from "lucide-react";

export default function AuditorDashboard({ user, cases }: { user: User; cases: ICase[] }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState<"all" | "active">("all");

    const filteredCases = cases.filter(c => {
        const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             c._id.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
                             (c.caseId && c.caseId.toLowerCase().includes(searchQuery.toLowerCase()));
        
        if (filterType === "active") {
            return matchesSearch && c.status === "Open";
        }
        return matchesSearch;
    });

    const openCases = cases.filter(c => c.status === "Open").length;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left Sidebar Layout */}
            <div className="lg:col-span-4 flex flex-col justify-center lg:sticky lg:top-32 lg:h-[calc(100vh-10rem)]">
                <div className="space-y-6 lg:transform lg:-translate-y-12">
                    <div>
                        <h1 className="text-5xl lg:text-7xl font-extrabold text-white tracking-tight leading-tight">
                            Compliance <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                                Protocol
                            </span>
                        </h1>
                        <p className="text-slate-400 mt-4 text-lg font-medium flex items-center gap-2">
                            Auditor, <span className="text-white">{user.name}</span>
                        </p>
                    </div>

                    <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 px-6 py-4 rounded-2xl flex items-start gap-4">
                        <CheckSquare size={24} className="shrink-0 mt-0.5" />
                        <p className="text-sm font-medium leading-relaxed">
                            Authorized for strict immutability checks and ledger compliance audits. Data modification is locked globally.
                        </p>
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-4">
                        <button 
                            onClick={() => setFilterType("all")}
                            className={`p-5 rounded-2xl backdrop-blur-xl text-left transition-all outline-none focus:ring-2 focus:ring-amber-500/50 ${
                                filterType === "all" 
                                    ? "bg-amber-500/20 border border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)] transform scale-[1.02]" 
                                    : "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20"
                            }`}
                        >
                            <div className="text-amber-400 mb-2"><ShieldCheck size={20} /></div>
                            <p className="text-2xl font-bold text-white leading-none mt-1">{cases.length}</p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Verified Chains</p>
                        </button>
                        <button 
                            onClick={() => setFilterType(filterType === "active" ? "all" : "active")}
                            className={`p-5 rounded-2xl backdrop-blur-xl text-left transition-all outline-none focus:ring-2 focus:ring-orange-500/50 ${
                                filterType === "active" 
                                    ? "bg-orange-500/20 border border-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.3)] transform scale-[1.02]" 
                                    : "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20"
                            }`}
                        >
                            <div className="text-orange-400 mb-2"><ActivitySquare size={20} /></div>
                            <p className="text-2xl font-bold text-white leading-none mt-1">{openCases}</p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Active Audits</p>
                        </button>
                    </div>
                </div>
            </div>

            {/* Right Content Area */}
            <div className="lg:col-span-8">
                <div className="bg-white rounded-[2rem] shadow-2xl p-6 md:p-10 min-h-[600px] border border-slate-100 flex flex-col">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                        <h2 className="text-2xl font-bold text-slate-800">Immutable Ledger Logs</h2>
                        
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="text" 
                                placeholder="Query history..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-transparent focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 transition-all outline-none"
                            />
                        </div>
                    </div>

                    {filteredCases.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center py-20 px-4">
                            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100 shadow-sm">
                                <CheckSquare size={40} className="text-slate-300" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-700 mb-2">Clean Ledger</h3>
                            <p className="text-slate-500 max-w-sm">
                                {searchQuery ? "No logs match your parameters." : "No chain-of-custody ledgers currently logged."}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {filteredCases.map((c) => (
                                <Link href={`/dashboard/cases/${c._id as unknown as string}`} key={c._id as unknown as string}>
                                    <div className="group bg-white border border-slate-200 p-6 rounded-2xl hover:border-amber-400 hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
                                        
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                                        <div className="flex-1 min-w-0">
                                            {c.caseId && (
                                                <div className="text-sm font-bold text-amber-500 mb-1 tracking-wide">
                                                    {c.caseId}
                                                </div>
                                            )}
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-bold text-lg text-slate-800 truncate group-hover:text-amber-600 transition-colors">
                                                    {c.title}
                                                </h3>
                                                <span
                                                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                                                        c.status === "Open"
                                                            ? "bg-green-100 text-green-700 border border-green-200"
                                                            : c.status === "Closed"
                                                                ? "bg-slate-100 text-slate-600 border border-slate-200"
                                                                : "bg-amber-100 text-amber-700 border border-amber-200"
                                                    }`}
                                                >
                                                    {c.status}
                                                </span>
                                            </div>
                                            
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="flex items-center gap-1 text-xs font-semibold bg-amber-50 text-amber-700 px-2 py-1 rounded border border-amber-100">
                                                    <ShieldCheck size={12} />
                                                    Integrity Intact 
                                                </div>
                                                <code className="text-xs text-slate-400 ml-2 truncate max-w-[150px] sm:max-w-md">
                                                    ID: {c.caseId || (c._id as unknown as string)}
                                                </code>
                                            </div>

                                            <p className="text-slate-500 text-sm line-clamp-1 pr-4">
                                                {c.description}
                                            </p>
                                        </div>

                                        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto mt-4 sm:mt-0 gap-4 sm:gap-2 border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-100">
                                            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg whitespace-nowrap">
                                                <Clock size={14} />
                                                {new Date(c.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                            
                                            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors shrink-0">
                                                <ArrowRight size={16} />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
