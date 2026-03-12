"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { ICase } from "@/models/Case";
import { ArrowLeft, Clock, ShieldCheck, Box, Users, FileText, Hash, Key, Fingerprint, X } from "lucide-react";

export interface ICustodyLog {
    _id: string;
    evidenceHash: string;
    action: string;
    performedBy: { name: string; email: string; role: string };
    transferredTo?: { name: string; email: string; role: string };
    locationStatus: string;
    notes: string;
    timestamp: string;
}

export default function ViewCase() {
    const router = useRouter();
    const params = useParams();
    const caseId = params?.id as string; // Fix TS error
    const { user, isLoading: authLoading } = useAuth();

    const [caseItem, setCaseItem] = useState<ICase | null>(null);
    const [custodyLogs, setCustodyLogs] = useState<ICustodyLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [isLogModalOpen, setIsLogModalOpen] = useState(false);
    const [selectedEvidence, setSelectedEvidence] = useState<string>("");

    const [isSubmittingLog, setIsSubmittingLog] = useState(false);
    const [logForm, setLogForm] = useState({
        action: "Checked Out",
        locationStatus: "Analyst Desk",
        notes: ""
    });

    const [verifyingHash, setVerifyingHash] = useState<string | null>(null);
    const [verificationStatus, setVerificationStatus] = useState<{hash: string, status: 'success' | 'error' | 'loading', message?: string} | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
        }
    }, [user, authLoading, router]);

    const fetchCaseDetails = async () => {
        try {
            const [caseRes, custodyRes] = await Promise.all([
                fetch(`/api/cases/${caseId}`),
                fetch(`/api/custody/${caseId}`)
            ]);

            if (caseRes.ok) {
                const caseData = await caseRes.json();
                setCaseItem(caseData);
            } else {
                const data = await caseRes.json();
                setError(data.error || "Failed to load case details");
                return;
            }

            if (custodyRes.ok) {
                const custodyData = await custodyRes.json();
                setCustodyLogs(custodyData);
            }
        } catch (err) {
            console.error("Error fetching data:", err);
            setError("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && caseId) {
            fetchCaseDetails();
        }
    }, [user, caseId]);

    const handleLogSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!logForm.notes.trim()) return;

        setIsSubmittingLog(true);
        try {
            const response = await fetch("/api/custody", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    caseId,
                    evidenceHash: selectedEvidence,
                    ...logForm
                }),
            });

            if (response.ok) {
                await fetchCaseDetails(); // Refresh timeline
                setIsLogModalOpen(false);
                setLogForm({ action: "Checked Out", locationStatus: "Analyst Desk", notes: "" });
            } else {
                const data = await response.json();
                alert(data.error || "Failed to submit log");
            }
        } catch (err) {
            console.error(err);
            alert("Unexpected error.");
        } finally {
            setIsSubmittingLog(false);
        }
    };

    const handleVerifyClick = (hash: string) => {
        setVerifyingHash(hash);
        setVerificationStatus(null);
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !verifyingHash) return;

        setVerificationStatus({ hash: verifyingHash, status: 'loading', message: 'Calculating hash...' });

        try {
            const buffer = await file.arrayBuffer();
            const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const calculatedHash = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

            if (calculatedHash === verifyingHash) {
                setVerificationStatus({ hash: verifyingHash, status: 'success', message: 'Verification Successful: Hash Matches Ledger' });
                
                // Automatically log the verification
                await fetch("/api/custody", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        caseId,
                        evidenceHash: verifyingHash,
                        action: "Hash Verified",
                        locationStatus: "System Verification",
                        notes: "File automatically hashed in browser and verified against immutable ledger."
                    }),
                });
                await fetchCaseDetails(); // Refresh timeline
            } else {
                setVerificationStatus({ hash: verifyingHash, status: 'error', message: 'TAMPERING DETECTED: Hash Mismatch' });
            }
        } catch (error) {
            setVerificationStatus({ hash: verifyingHash, status: 'error', message: 'Error calculating hash.' });
        } finally {
            e.target.value = ''; // Reset file input
            setVerifyingHash(null);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[#020617]">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                    <p className="text-blue-400 font-mono text-sm uppercase tracking-widest">Decrypting Ledger...</p>
                </div>
            </div>
        );
    }

    if (!user) return null;

    if (error) {
        return (
            <div className="min-h-screen bg-[#020617] pt-32 pb-12 px-6 flex justify-center">
                <div className="max-w-md w-full text-center">
                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Box size={32} className="text-red-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
                    <p className="text-slate-400 mb-8">{error}</p>
                    <Link href="/dashboard" className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-colors inline-block">
                        Return to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    if (!caseItem) return null;

    return (
        <div className="min-h-screen bg-[#020617] pt-24 pb-12 px-6">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-slate-300 transition-colors">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-extrabold text-white tracking-tight">Ledger Overview</h1>
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                                        caseItem.status === "Open"
                                            ? "bg-green-500/10 text-green-400 border-green-500/20"
                                            : caseItem.status === "Closed"
                                                ? "bg-slate-500/10 text-slate-400 border-slate-500/20"
                                                : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                    }`}
                                >
                                    {caseItem.status}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 mt-2 font-mono text-xs text-slate-500">
                                <Fingerprint size={12} />
                                <span>ID: {caseItem._id as unknown as string}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Left Column - Main Details */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white/5 mx-auto border border-white/10 rounded-[2rem] p-8 backdrop-blur-xl">
                            <h2 className="text-3xl font-bold text-white mb-6 leading-tight">{caseItem.title}</h2>
                            
                            <div className="flex items-center gap-4 text-xs font-medium text-slate-400 bg-black/20 p-4 rounded-2xl mb-8 border border-white/5">
                                <div className="flex items-center gap-2">
                                    <Clock size={16} className="text-blue-400" />
                                    <span>Created: {new Date(caseItem.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</span>
                                </div>
                                <div className="w-1 h-1 bg-slate-700 rounded-full"></div>
                                <div className="flex items-center gap-2">
                                    <Key size={16} className="text-purple-400" />
                                    <span>Secured</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-white flex items-center gap-2 border-b border-white/10 pb-3">
                                    <FileText className="text-blue-400" size={18} />
                                    Incident Summary
                                </h3>
                                <div className="p-6 bg-black/20 rounded-2xl border border-white/5">
                                    <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{caseItem.description}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 backdrop-blur-xl space-y-6">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2 border-b border-white/10 pb-3 block">
                                <Hash className="text-blue-400" size={18} />
                                Linked Evidence Vault
                            </h3>

                            {caseItem.evidence && caseItem.evidence.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                    {caseItem.evidence.map((item, idx) => {
                                        const isImage = item.fileName && (item.fileName.toLowerCase().endsWith('.png') || item.fileName.toLowerCase().endsWith('.jpg') || item.fileName.toLowerCase().endsWith('.jpeg') || item.fileName.toLowerCase().endsWith('.webp'));
                                        
                                        return (
                                        <div key={idx} className="bg-black/20 p-5 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-colors group flex flex-col h-full">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center gap-2 overflow-hidden">
                                                    <Box size={16} className="text-slate-400 shrink-0" />
                                                    <p className="font-bold text-white truncate pr-2" title={item.fileName}>{item.fileName}</p>
                                                </div>
                                                <span className="text-[10px] font-bold uppercase tracking-wider bg-white/10 text-slate-300 px-2 py-1 rounded-md shrink-0">
                                                    {(item.fileSize / 1024).toFixed(1)} KB
                                                </span>
                                            </div>
                                            <div className="text-xs text-slate-500 mb-4 flex items-center gap-1.5">
                                                <Clock size={12} />
                                                <span>{new Date(item.uploadedAt).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}</span>
                                            </div>
                                            
                                            {item.fileUrl && isImage && (
                                                <div className="mb-4 rounded-xl overflow-hidden border border-white/10 flex-1 min-h-[150px] relative bg-black/50">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img 
                                                        src={item.fileUrl} 
                                                        alt={item.fileName}
                                                        className="w-full h-full object-cover absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                </div>
                                            )}

                                            <div className="bg-blue-950/30 p-3 rounded-xl border border-blue-500/10 relative overflow-hidden mt-auto">
                                                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                                                <div className="flex justify-between items-center mb-1">
                                                    <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">{item.hashAlgorithm} Hash</p>
                                                    <ShieldCheck size={12} className="text-blue-400" />
                                                </div>
                                                <p className="text-xs font-mono text-slate-300 break-all select-all">
                                                    {item.hash}
                                                </p>
                                            </div>
                                            
                                            {/* Action Button for Roles */}
                                            {user?.role && ["Custodian", "Analyst", "Investigator", "Auditor"].includes(user.role) && (
                                                <>
                                                    <div className="flex gap-2 mt-4 mt-auto">
                                                        <button 
                                                            onClick={() => {
                                                                setSelectedEvidence(item.hash);
                                                                setIsLogModalOpen(true);
                                                            }}
                                                            className="flex-1 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-colors"
                                                        >
                                                            Log Action
                                                        </button>
                                                        <button 
                                                            onClick={() => handleVerifyClick(item.hash)}
                                                            disabled={verificationStatus?.hash === item.hash && verificationStatus.status === 'loading'}
                                                            className="flex-1 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-colors disabled:opacity-50"
                                                        >
                                                            {verificationStatus?.hash === item.hash && verificationStatus.status === 'loading' ? 'Verifying...' : 'Verify Hash'}
                                                        </button>
                                                    </div>
                                                    {verificationStatus?.hash === item.hash && verificationStatus.status !== 'loading' && (
                                                        <div className={`mt-2 p-2 rounded-xl text-[10px] font-bold uppercase tracking-wider text-center ${verificationStatus.status === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                                                            {verificationStatus.message}
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    )})}
                                </div>
                            ) : (
                                <div className="p-8 bg-black/20 rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center">
                                    <Box size={32} className="text-slate-600 mb-3" />
                                    <p className="text-slate-400 font-medium">No verified evidence linked to this ledger.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Entities & Chain of Custody */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 backdrop-blur-xl">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2 border-b border-white/10 pb-3 mb-6">
                                <Users className="text-blue-400" size={18} />
                                Involved Entities
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Suspects</h4>
                                    {caseItem.suspects && caseItem.suspects.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {caseItem.suspects.map((s, i) => (
                                                <span key={i} className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-200 text-sm rounded-lg">
                                                    {s}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-slate-600 italic text-sm">None recorded</p>
                                    )}
                                </div>

                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">In-Charges</h4>
                                    {caseItem.inCharges && caseItem.inCharges.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {caseItem.inCharges.map((ic, i) => (
                                                <span key={i} className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-200 text-sm rounded-lg">
                                                    {ic}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-slate-600 italic text-sm">None recorded</p>
                                    )}
                                </div>

                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Witnesses</h4>
                                    {caseItem.witnesses && caseItem.witnesses.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {caseItem.witnesses.map((w, i) => (
                                                <span key={i} className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 text-sm rounded-lg">
                                                    {w}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-slate-600 italic text-sm">None recorded</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Chain of Custody Timeline */}
                        <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 backdrop-blur-xl">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2 border-b border-white/10 pb-3 mb-6">
                                <ShieldCheck className="text-purple-400" size={18} />
                                Chain of Custody
                            </h3>

                            {custodyLogs.length > 0 ? (
                                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-700 before:to-transparent">
                                    {custodyLogs.map((log, index) => (
                                        <div key={log._id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-black/50 text-slate-400 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow flex-col gap-1 z-10">
                                                <Fingerprint size={16} className={log.action === "Uploaded" ? "text-emerald-400" : log.action === "Checked Out" ? "text-amber-400" : "text-blue-400"} />
                                            </div>

                                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white/5 p-4 rounded-xl border border-white/10">
                                                <div className="flex items-center justify-between space-x-2 mb-1">
                                                    <div className="font-bold text-white text-sm">{log.action}</div>
                                                    <time className="font-mono text-[10px] text-slate-500">
                                                        {new Date(log.timestamp).toLocaleDateString()}
                                                    </time>
                                                </div>
                                                <div className="text-xs text-slate-400 mb-2">
                                                    <span className="font-semibold text-slate-300">{log.performedBy.name}</span> ({log.performedBy.role})
                                                </div>
                                                <div className="text-xs text-slate-500 italic bg-black/20 p-2 rounded truncate" title={log.notes}>
                                                    "{log.notes}"
                                                </div>
                                                <div className="text-[10px] mt-2 font-mono text-slate-600 truncate" title={log.evidenceHash}>
                                                    {log.evidenceHash.substring(0, 16)}...
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-slate-500 italic text-center py-4">No custody logs recorded yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {/* Log Interaction Modal */}
            {isLogModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsLogModalOpen(false)}></div>
                    <div className="bg-slate-900 border border-white/10 p-6 sm:p-8 rounded-[2rem] w-full max-w-md relative z-10 shadow-2xl">
                        <button 
                            onClick={() => setIsLogModalOpen(false)}
                            className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                            <ShieldCheck className="text-emerald-400" size={24} />
                            <h3 className="text-xl font-bold text-white">Log Evidence Interaction</h3>
                        </div>

                        <form onSubmit={handleLogSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Action</label>
                                <select 
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                                    value={logForm.action}
                                    onChange={(e) => setLogForm({...logForm, action: e.target.value})}
                                >
                                    <option value="Checked Out">Checked Out</option>
                                    <option value="Checked In">Checked In</option>
                                    <option value="Transferred">Transferred</option>
                                    <option value="Hash Verified">Hash Verified</option>
                                    <option value="Archived">Archived</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Location / Status</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. Forensics Lab Desk 3"
                                    required
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-600"
                                    value={logForm.locationStatus}
                                    onChange={(e) => setLogForm({...logForm, locationStatus: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Notes</label>
                                <textarea 
                                    rows={3}
                                    placeholder="Reason for interaction..."
                                    required
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all resize-none placeholder:text-slate-600"
                                    value={logForm.notes}
                                    onChange={(e) => setLogForm({...logForm, notes: e.target.value})}
                                ></textarea>
                            </div>

                            <button 
                                type="submit" 
                                disabled={isSubmittingLog}
                                className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 px-4 rounded-xl transition-colors shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmittingLog ? "Committing to Ledger..." : "Commit Action"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Hidden File Input for Hash Verification */}
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
            />
        </div>
    );
}

