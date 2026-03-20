"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, Shield, Upload, FileText, Users, Hash } from "lucide-react";

type HashResult = {
    fileName: string;
    fileSize: number;
    hashAlgorithm: string;
    hash: string;
    fileUrl?: string;
    uploadedAt: string;
};

export default function CreateCase() {
    const router = useRouter();
    const { user, isLoading: authLoading } = useAuth();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [suspects, setSuspects] = useState("");
    const [inCharges, setInCharges] = useState("");
    const [witnesses, setWitnesses] = useState("");

    const [file, setFile] = useState<File | null>(null);
    const [evidence, setEvidence] = useState<HashResult[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    const [availableInvestigators, setAvailableInvestigators] = useState<{_id: string, name: string}[]>([]);
    const [selectedInvestigators, setSelectedInvestigators] = useState<string[]>([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleUploadEvidence = async () => {
        if (!file) return;

        setIsUploading(true);
        setError("");

        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to upload evidence");
            }

            const data: HashResult = await res.json();
            setEvidence([...evidence, data]);
            setFile(null);
        } catch (err: any) {
            setError(err.message || "Failed to generate hash");
            console.error(err);
        } finally {
            setIsUploading(false);
        }
    };

    useEffect(() => {
        const fetchInvestigators = async () => {
            try {
                const res = await fetch("/api/users/investigators");
                if (res.ok) {
                   const data = await res.json();
                   setAvailableInvestigators(data);
                }
            } catch (err) {
                 console.error("Failed to fetch investigators:", err);
            }
        };

        if (!authLoading) {
            if (!user) {
                router.push("/login");
            } else if (user.role !== "Investigator") {
                router.push("/dashboard");
            } else {
                fetchInvestigators();
            }
        }
    }, [user, authLoading, router]);

    if (authLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[#020617]">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                    <p className="text-blue-400 font-mono text-sm uppercase tracking-widest">Verifying Identity...</p>
                </div>
            </div>
        );
    }
    
    if (!user || user.role !== "Investigator") {
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const toArray = (str: string) => {
            const arr = str.split(",").map(item => item.trim()).filter(item => item !== "");
            return arr.length > 0 ? arr : [];
        };

        try {
            const response = await fetch("/api/cases", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    description,
                    suspects: toArray(suspects),
                    inCharges: toArray(inCharges),
                    witnesses: toArray(witnesses),
                    evidence: evidence,
                    assignedInvestigators: selectedInvestigators,
                }),
            });

            if (response.ok) {
                router.push("/dashboard");
            } else {
                const data = await response.json();
                setError(data.error || "Failed to create case");
            }
        } catch (err) {
            setError("An unexpected error occurred");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] pt-24 pb-12 px-6">
            <div className="max-w-4xl mx-auto">
                
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/dashboard" className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-slate-300 transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-extrabold text-white tracking-tight">Initialize Case Ledger</h1>
                        <p className="text-slate-400 mt-1">Create a new secure chain-of-custody immutable record.</p>
                    </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden backdrop-blur-xl">
                    {error && (
                        <div className="bg-red-500/10 border-b border-red-500/20 text-red-400 p-4 flex items-center gap-3 text-sm px-8">
                            <Shield className="shrink-0" size={16} />
                            <p>{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8">
                        
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2 border-b border-white/10 pb-4">
                                <FileText className="text-blue-400" size={20} />
                                Primary Details
                            </h3>
                            
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-widest text-slate-400 ml-1">Case Title *</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Enter case designation"
                                    className="w-full bg-black/20 border border-white/10 rounded-2xl py-3.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:bg-white/5 transition-all placeholder:text-slate-600"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-widest text-slate-400 ml-1">Case Description *</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Provide detailed incident summary..."
                                    className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 px-4 h-32 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:bg-white/5 transition-all placeholder:text-slate-600 resize-none"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2 border-b border-white/10 pb-4 pt-4">
                                <Users className="text-blue-400" size={20} />
                                Involved Entities
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase tracking-widest text-slate-400 ml-1">
                                        Suspects <span className="font-normal text-slate-500 lowercase ml-1">(comma separated)</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={suspects}
                                        onChange={(e) => setSuspects(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded-2xl py-3.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:bg-white/5 transition-all placeholder:text-slate-600"
                                        placeholder="John Doe, Jane Smith"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase tracking-widest text-slate-400 ml-1">
                                        In-Charges <span className="font-normal text-slate-500 lowercase ml-1">(comma separated)</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={inCharges}
                                        onChange={(e) => setInCharges(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded-2xl py-3.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:bg-white/5 transition-all placeholder:text-slate-600"
                                        placeholder="Officer Smith"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-widest text-slate-400 ml-1">
                                    Witnesses <span className="font-normal text-slate-500 lowercase ml-1">(comma separated)</span>
                                </label>
                                <input
                                    type="text"
                                    value={witnesses}
                                    onChange={(e) => setWitnesses(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-2xl py-3.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:bg-white/5 transition-all placeholder:text-slate-600"
                                    placeholder="Alice, Bob"
                                />
                            </div>

                            {availableInvestigators.length > 0 && (
                                <div className="space-y-3 mt-6 pt-4 border-t border-white/5">
                                    <label className="text-xs font-semibold uppercase tracking-widest text-slate-400 ml-1">
                                        Assign Co-Investigators <span className="font-normal text-slate-500 lowercase ml-1">(Optional)</span>
                                    </label>
                                    <div className="bg-black/20 border border-white/10 rounded-2xl p-4 max-h-48 overflow-y-auto space-y-2">
                                        {availableInvestigators.map(inv => (
                                            <label key={inv._id} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg cursor-pointer transition-colors user-select-none">
                                                <input 
                                                    type="checkbox" 
                                                    className="w-4 h-4 rounded border-white/20 bg-black/50 text-blue-500 focus:ring-blue-500/50"
                                                    checked={selectedInvestigators.includes(inv._id)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedInvestigators([...selectedInvestigators, inv._id]);
                                                        } else {
                                                            setSelectedInvestigators(selectedInvestigators.filter(id => id !== inv._id));
                                                        }
                                                    }}
                                                />
                                                <span className="text-sm font-medium text-slate-300">{inv.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2 border-b border-white/10 pb-4 pt-4">
                                <Hash className="text-blue-400" size={20} />
                                Cryptographic Evidence Verification
                            </h3>

                            <div className="p-6 bg-blue-950/20 border border-blue-500/20 rounded-2xl">
                                <p className="text-sm text-slate-300 mb-4 font-medium">
                                    Attach digital evidence. A secure SHA-256 cryptographic hash will be permanently generated.
                                </p>
                                
                                <div className="flex flex-col sm:flex-row items-center gap-4">
                                    <div className="relative w-full">
                                        <input
                                            type="file"
                                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                                            className="block w-full text-sm text-slate-400
                                            file:mr-4 file:py-3 file:px-6
                                            file:rounded-xl file:border-0
                                            file:text-sm file:font-semibold
                                            file:bg-white/10 file:text-white
                                            hover:file:bg-white/20 file:transition-colors file:cursor-pointer
                                            bg-black/20 rounded-xl border border-white/10"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleUploadEvidence}
                                        disabled={isUploading || !file}
                                        className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors whitespace-nowrap flex items-center justify-center gap-2"
                                    >
                                        <Upload size={18} />
                                        {isUploading ? "Hashing Data..." : "Upload & Hash"}
                                    </button>
                                </div>

                                {evidence.length > 0 && (
                                    <div className="mt-6 space-y-3">
                                        <p className="font-semibold text-sm text-white flex items-center gap-2">
                                            <Shield size={16} className="text-green-400" />
                                            Secured Evidence ({evidence.length})
                                        </p>
                                        {evidence.map((item, idx) => (
                                            <div key={idx} className="bg-black/40 p-4 rounded-xl border border-white/5 text-sm">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="font-medium text-white break-words pr-2">{item.fileName}</span>
                                                    <span className="text-xs text-slate-400 shrink-0 bg-white/5 px-2 py-1 rounded-md">{(item.fileSize / 1024).toFixed(1)} KB</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs font-mono break-all mt-2 bg-blue-900/10 p-2.5 rounded-lg border border-blue-500/10">
                                                    <span className="text-blue-400 shrink-0 font-bold">{item.hashAlgorithm}:</span>
                                                    <span className="text-slate-300">{item.hash}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-end gap-4">
                            <Link
                                href="/dashboard"
                                className="px-8 py-4 text-white bg-white/5 hover:bg-white/10 rounded-2xl font-bold transition-colors text-center"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-white text-black px-8 py-4 rounded-2xl font-bold hover:bg-blue-500 hover:text-white transition-all transform hover:-translate-y-1 shadow-[0_0_20px_rgba(255,255,255,0.2)] disabled:opacity-50 disabled:transform-none disabled:shadow-none"
                            >
                                {loading ? "Committing Ledger..." : "Commit Case Ledger"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

