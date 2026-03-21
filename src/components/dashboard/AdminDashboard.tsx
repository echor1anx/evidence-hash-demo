"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { User } from "@/context/AuthContext";
import { ICase } from "@/models/Case";
import { Users, Database, ShieldAlert, CheckCircle2, XCircle, Activity, FileText, Clock, ArrowRight, Search } from "lucide-react";
import BlockchainVerification from "@/components/BlockchainVerification";

type PendingUser = {
    _id: string;
    name: string;
    email: string;
    role: string;
    organization: string;
    department: string;
    designation: string;
    status: string;
    createdAt: string;
};

export default function AdminDashboard({ user, cases }: { user: User; cases: ICase[] }) {
    const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
    const [approvedUsers, setApprovedUsers] = useState<PendingUser[]>([]);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'pending' | 'ledgers' | 'agents' | 'health' | 'verification'>('pending');
    const [evidenceInput, setEvidenceInput] = useState<string>('');
    const [evidenceToVerify, setEvidenceToVerify] = useState<string | undefined>(undefined);
    const [systemMetrics, setSystemMetrics] = useState({
        totalUsers: 0,
        pendingApprovals: 0,
        totalCases: cases.length,
        systemHealth: "100%"
    });

    useEffect(() => {
        fetchPendingUsers();
        // In a real app, fetch total users here for systemAnalytics. 
        // For now we'll mock it based on pending approvals list.
    }, []);

    const fetchPendingUsers = async () => {
        try {
            const res = await fetch('/api/admin/requests');
            if (res.ok) {
                const data = await res.json();
                setPendingUsers(data.users);
                setApprovedUsers(data.approvedUsers || []);
                setSystemMetrics(prev => ({
                    ...prev,
                    pendingApprovals: data.users.length,
                    totalUsers: data.totalUsers || 0
                }));
            }
        } catch (error) {
            console.error('Failed to fetch user requests:', error);
        }
    };

    const handleAction = async (userId: string, action: 'approved' | 'rejected') => {
        setActionLoading(userId);
        try {
            const res = await fetch(`/api/admin/requests/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: action }),
            });

            if (res.ok) {
                setPendingUsers(prev => prev.filter(u => u._id !== userId));
                setSystemMetrics(prev => ({
                    ...prev,
                    pendingApprovals: prev.pendingApprovals - 1,
                    totalUsers: action === 'approved' ? prev.totalUsers + 1 : prev.totalUsers
                }));
            }
        } catch (error) {
            console.error(`Failed to ${action} user:`, error);
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left Sidebar Layout */}
            <div className="lg:col-span-4 flex flex-col justify-center lg:sticky lg:top-32 lg:h-[calc(100vh-10rem)]">
                <div className="space-y-6 lg:transform lg:-translate-y-12">
                    <div>
                        <h1 className="text-5xl lg:text-7xl font-extrabold text-white tracking-tight leading-tight">
                            System <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                                Analytics
                            </span>
                        </h1>
                        <p className="text-slate-400 mt-4 text-lg font-medium flex items-center gap-2">
                            Security Admin, <span className="text-white">{user.name}</span>
                        </p>
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-4">
                        <button 
                            onClick={() => setActiveTab('ledgers')}
                            className={`p-5 rounded-2xl backdrop-blur-xl text-left transition-all outline-none focus:ring-2 focus:ring-purple-500/50 ${
                                activeTab === 'ledgers' 
                                    ? "bg-purple-500/20 border border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)] transform scale-[1.02]" 
                                    : "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20"
                            }`}
                        >
                            <div className="text-purple-400 mb-2"><Database size={20} /></div>
                            <p className="text-2xl font-bold text-white leading-none mt-1">{systemMetrics.totalCases}</p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Active Ledgers</p>
                        </button>
                        <button 
                            onClick={() => setActiveTab('agents')}
                            className={`p-5 rounded-2xl backdrop-blur-xl text-left transition-all outline-none focus:ring-2 focus:ring-blue-500/50 ${
                                activeTab === 'agents' 
                                    ? "bg-blue-500/20 border border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)] transform scale-[1.02]" 
                                    : "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20"
                            }`}
                        >
                            <div className="text-blue-400 mb-2"><Users size={20} /></div>
                            <p className="text-2xl font-bold text-white leading-none mt-1">{systemMetrics.totalUsers}</p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Verified Agents</p>
                        </button>
                        <button 
                            onClick={() => setActiveTab('pending')}
                            className={`p-5 rounded-2xl backdrop-blur-xl text-left transition-all outline-none focus:ring-2 focus:ring-orange-500/50 ${
                                activeTab === 'pending' 
                                    ? "bg-orange-500/20 border border-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.3)] transform scale-[1.02]" 
                                    : "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20"
                            }`}
                        >
                            <div className="text-orange-400 mb-2"><ShieldAlert size={20} /></div>
                            <p className="text-2xl font-bold text-white leading-none mt-1">{systemMetrics.pendingApprovals}</p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Pending Auth</p>
                        </button>
                        <button 
                            onClick={() => setActiveTab('health')}
                            className={`p-5 rounded-2xl backdrop-blur-xl text-left transition-all outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                                activeTab === 'health' 
                                    ? "bg-emerald-500/20 border border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)] transform scale-[1.02]" 
                                    : "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20"
                            }`}
                        >
                            <div className="text-emerald-400 mb-2"><Activity size={20} /></div>
                            <p className="text-2xl font-bold text-white leading-none mt-1">{systemMetrics.systemHealth}</p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Network Health</p>
                        </button>
                        <button 
                            onClick={() => setActiveTab('verification')}
                            className={`p-5 rounded-2xl backdrop-blur-xl text-left transition-all outline-none md:col-span-2 focus:ring-2 focus:ring-indigo-500/50 ${
                                activeTab === 'verification' 
                                    ? "bg-indigo-500/20 border border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.3)] transform scale-[1.02]" 
                                    : "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20"
                            }`}
                        >
                            <div className="text-indigo-400 mb-2"><Search size={20} /></div>
                            <p className="text-sm font-bold text-white leading-none mt-1">Chain Verification</p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Verify Evidence</p>
                        </button>
                    </div>
                </div>
            </div>

            {/* Right Content Area */}
            <div className="lg:col-span-8">
                <div className="bg-white rounded-[2rem] shadow-2xl p-6 md:p-10 min-h-[600px] border border-slate-100 flex flex-col">
                    {activeTab === 'pending' && (
                        <>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-slate-100 pb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800">Clearance Authorization</h2>
                                    <p className="text-sm text-slate-500 mt-1">Review and approve new agent registration requests.</p>
                                </div>
                                <div className="flex items-center gap-2 bg-orange-50 text-orange-600 px-3 py-1.5 rounded-full text-xs font-bold border border-orange-100">
                                    <ShieldAlert size={14} />
                                    {pendingUsers.length} Action{pendingUsers.length !== 1 ? 's' : ''} Required
                                </div>
                            </div>

                            {pendingUsers.length === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-center py-20 px-4">
                                    <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6 border border-emerald-100 shadow-sm">
                                        <CheckCircle2 size={40} className="text-emerald-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-700 mb-2">Zero Pending Requests</h3>
                                    <p className="text-slate-500 max-w-sm">
                                        All user registrations have been processed. System access is up to date.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-4">
                                    {pendingUsers.map((req) => (
                                        <div key={req._id} className="bg-white border border-slate-200 p-6 rounded-2xl hover:border-purple-300 hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col gap-4">
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-400 to-pink-500 opacity-100" />

                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <h3 className="font-bold text-lg text-slate-800">{req.name}</h3>
                                                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-purple-100 text-purple-700 border border-purple-200">
                                                            {req.role}
                                                        </span>
                                                    </div>
                                                    <p className="text-slate-500 text-sm">{req.email}</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm">
                                                <div>
                                                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-widest">Organization</span>
                                                    <span className="font-medium text-slate-700">{req.organization}</span>
                                                </div>
                                                <div>
                                                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-widest">Department</span>
                                                    <span className="font-medium text-slate-700">{req.department}</span>
                                                </div>
                                                <div>
                                                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-widest">Designation</span>
                                                    <span className="font-medium text-slate-700">{req.designation}</span>
                                                </div>
                                            </div>

                                            <div className="flex justify-end gap-3 pt-2">
                                                <button
                                                    onClick={() => handleAction(req._id, 'rejected')}
                                                    disabled={actionLoading === req._id}
                                                    className="px-4 py-2 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100 flex items-center gap-2 disabled:opacity-50"
                                                >
                                                    <XCircle size={16} />
                                                    Deny
                                                </button>
                                                <button
                                                    onClick={() => handleAction(req._id, 'approved')}
                                                    disabled={actionLoading === req._id}
                                                    className="px-4 py-2 text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                                                >
                                                    <CheckCircle2 size={16} />
                                                    Grant Access
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                    {activeTab === 'ledgers' && (
                        <>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-slate-100 pb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800">Active Ledgers</h2>
                                    <p className="text-sm text-slate-500 mt-1">Directory of all initialized cases traversing the system.</p>
                                </div>
                                <div className="flex items-center gap-2 bg-purple-50 text-purple-600 px-3 py-1.5 rounded-full text-xs font-bold border border-purple-100">
                                    <Database size={14} />
                                    {cases.length} Total Ledgers
                                </div>
                            </div>
                            
                            {cases.length === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-center py-20 px-4">
                                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100 shadow-sm">
                                        <Database size={40} className="text-slate-300" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-700 mb-2">No ledgers found</h3>
                                    <p className="text-slate-500 max-w-sm">
                                        No case ledgers enter the system yet.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-4">
                                    {cases.map((c) => (
                                        <div key={c._id as unknown as string} className="group bg-white border border-slate-200 p-6 rounded-2xl relative overflow-hidden flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-400 to-indigo-500" />

                                            <div className="flex-1 min-w-0">
                                                {c.caseId && (
                                                    <div className="text-sm font-bold text-purple-500 mb-1 tracking-wide">
                                                        {c.caseId}
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="font-bold text-lg text-slate-800 truncate">
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
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                    {activeTab === 'agents' && (
                        <>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-slate-100 pb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800">Verified Agents</h2>
                                    <p className="text-sm text-slate-500 mt-1">Directory of all approved personnel with system clearance.</p>
                                </div>
                                <div className="flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full text-xs font-bold border border-blue-100">
                                    <Users size={14} />
                                    {approvedUsers.length} Active Accounts
                                </div>
                            </div>

                            {approvedUsers.length === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-center py-20 px-4">
                                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100 shadow-sm">
                                        <Users size={40} className="text-slate-300" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-700 mb-2">No Active Agents</h3>
                                    <p className="text-slate-500 max-w-sm">
                                        There are currently no approved users in the system.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-4">
                                    {approvedUsers.map((u) => (
                                        <div key={u._id} className="bg-white border border-slate-200 p-6 rounded-2xl relative overflow-hidden flex flex-col gap-4">
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-cyan-500" />

                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <h3 className="font-bold text-lg text-slate-800">{u.name}</h3>
                                                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-100 text-blue-700 border border-blue-200">
                                                            {u.role}
                                                        </span>
                                                    </div>
                                                    <p className="text-slate-500 text-sm">{u.email}</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm">
                                                <div>
                                                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-widest">Organization</span>
                                                    <span className="font-medium text-slate-700">{u.organization}</span>
                                                </div>
                                                <div>
                                                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-widest">Department</span>
                                                    <span className="font-medium text-slate-700">{u.department}</span>
                                                </div>
                                                <div>
                                                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-widest">Designation</span>
                                                    <span className="font-medium text-slate-700">{u.designation}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                    {activeTab === 'health' && (
                        <div className="flex-1 flex flex-col items-center justify-center text-center py-20 px-4">
                            <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6 border border-emerald-100 shadow-sm relative">
                                <Activity size={40} className="text-emerald-500 relative z-10" />
                                <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-20"></div>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800 mb-2">System Optimal</h3>
                            <p className="text-slate-500 max-w-sm">
                                All network nodes and cryptographic ledgers are responding nominally. No anomalies detected.
                            </p>
                        </div>
                    )}

                    {activeTab === 'verification' && (
                        <div className="flex flex-col h-full">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-slate-100 pb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800">Chain Verification</h2>
                                    <p className="text-sm text-slate-500 mt-1">Directly query the blockchain for evidence immutability.</p>
                                </div>
                                <div className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full text-xs font-bold border border-indigo-100">
                                    <Search size={14} />
                                    Query Network Node
                                </div>
                            </div>

                            <div className="max-w-2xl w-full mb-8">
                                <label htmlFor="evidenceId" className="block text-sm font-bold text-slate-700 mb-2">Case ID (Evidence Identifier)</label>
                                <div className="flex gap-4">
                                    <input 
                                        type="text" 
                                        id="evidenceId"
                                        placeholder="e.g. CAS-1001"
                                        className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all font-mono text-sm text-slate-900 placeholder:text-slate-400"
                                        value={evidenceInput}
                                        onChange={(e) => setEvidenceInput(e.target.value)}
                                    />
                                    <button 
                                        onClick={() => setEvidenceToVerify(evidenceInput)}
                                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2"
                                    >
                                        <Search size={18} />
                                        Verify
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1">
                                {evidenceToVerify ? (
                                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <BlockchainVerification evidenceId={evidenceToVerify} />
                                    </div>
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center text-center py-20 px-4">
                                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100 shadow-sm relative">
                                            <Search size={40} className="text-slate-300 relative z-10" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-700 mb-2">Awaiting Target</h3>
                                        <p className="text-slate-500 max-w-sm">
                                            Enter an Evidence ID above to initiate a query against the blockchain network.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
