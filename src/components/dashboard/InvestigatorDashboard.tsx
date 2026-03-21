"use client";

import { useState } from "react";
import Link from "next/link";
import { ICase } from "@/models/Case";
import { User } from "@/context/AuthContext";
import { Plus, ArrowRight, FileText, Search, Clock } from "lucide-react";

export default function InvestigatorDashboard({ user, cases }: { user: User; cases: ICase[] }) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredCases = cases.filter(c => 
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c._id.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.caseId && c.caseId.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left Sidebar Layout */}
            <div className="lg:col-span-4 flex flex-col justify-center lg:sticky lg:top-32 lg:h-[calc(100vh-10rem)]">
                <div className="space-y-6 lg:transform lg:-translate-y-12">
                    <div>
                        <h1 className="text-5xl lg:text-7xl font-extrabold text-white tracking-tight leading-tight">
                            Investigator <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                                Dashboard
                            </span>
                        </h1>
                        <p className="text-slate-400 mt-4 text-lg font-medium flex items-center gap-2">
                            Welcome back, <span className="text-white">{user.name}</span>
                        </p>
                    </div>

                    <Link
                        href="/dashboard/cases/new"
                        className="group relative inline-flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-500 transition-all shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:shadow-[0_0_40px_rgba(37,99,235,0.5)] transform hover:-translate-y-1 w-max overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:animate-[shimmer_1.5s_infinite]" />
                        <span className="relative z-10 flex items-center gap-2">
                            <Plus size={20} className="w-5 h-5" />
                            Initialize Case Ledger
                        </span>
                    </Link>

                    <div className="mt-8 p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl">
                        <div className="flex items-center gap-4 text-slate-300">
                            <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl">
                                <FileText size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Total Active</p>
                                <p className="text-3xl font-bold text-white leading-none mt-1">{cases.length}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Content Area */}
            <div className="lg:col-span-8">
                <div className="bg-white rounded-[2rem] shadow-2xl p-6 md:p-10 min-h-[600px] border border-slate-100 flex flex-col">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                        <h2 className="text-2xl font-bold text-slate-800">Your Cases</h2>
                        
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="text" 
                                placeholder="Search cases..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 transition-all outline-none"
                            />
                        </div>
                    </div>

                    {filteredCases.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center py-20 px-4">
                            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100 shadow-sm">
                                <FileText size={40} className="text-slate-300" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-700 mb-2">No ledgers found</h3>
                            <p className="text-slate-500 max-w-sm">
                                {searchQuery ? "No cases match your search query." : "You haven't initialized any case ledgers yet. Create a new case to get started."}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {filteredCases.map((c) => (
                                <Link href={`/dashboard/cases/${c._id as unknown as string}`} key={c._id as unknown as string}>
                                    <div className="group bg-white border border-slate-200 p-6 rounded-2xl hover:border-blue-300 hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
                                        
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                                        <div className="flex-1 min-w-0">
                                            {c.caseId && (
                                                <div className="text-sm font-bold text-blue-500 mb-1 tracking-wide">
                                                    {c.caseId}
                                                </div>
                                            )}
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-bold text-lg text-slate-800 truncate group-hover:text-blue-600 transition-colors">
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
                                                <code className="text-xs bg-slate-50 text-slate-500 px-2 py-1 rounded border border-slate-100 truncate max-w-[200px] sm:max-w-md">
                                                    ID: {c.caseId || (c._id as unknown as string)}
                                                </code>
                                                {(c.createdBy as any)?._id !== user.id && (c.createdBy as any)?.name && (
                                                    <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded border border-indigo-100 font-semibold truncate shrink-0 max-w-[150px]">
                                                        Shared by {(c.createdBy as any).name}
                                                    </span>
                                                )}
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
                                            
                                            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
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
