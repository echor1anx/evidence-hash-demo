"use client";

import { useAuth } from "@/context/AuthContext";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import EvidenceUploader from "@/components/EvidenceUploader";
import { Shield, Clock, Search, FolderClosed, ArrowRight, UserCheck } from "lucide-react";
import Link from "next/link";

// Mock Evidence Data
const MOCK_EVIDENCE_DB = [
  {
    id: "EV-0X889",
    fileName: "crime_scene_photo_1.jpg",
    hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    uploadedBy: "Det. Sarah Jenkins",
    role: "Investigator",
    timestamp: "2026-02-15T09:12:00Z",
    status: "In Custody",
    custodyHistory: [
      { action: "Registered", by: "Det. Soni Chaudhary", time: "2026-02-15T09:12:00Z" },
      { action: "Transferred Custody", by: "Det. Soni Chaudhary", to: "Rian Renju (Custodian)", time: "2026-02-15T14:30:00Z" }
    ]
  },
  {
    id: "EV-0X890",
    fileName: "suspect_interview.mp4",
    hash: "8be3c943b1f5d6a2f4da89d3161c92d5bd5a1811e72d2459422a57342df39ba2",
    uploadedBy: "Det. Sarah Jenkins",
    role: "Investigator",
    timestamp: "2026-02-16T11:45:00Z",
    status: "Under Analysis",
    custodyHistory: [
      { action: "Registered", by: "Det. Disha Gupta", time: "2026-02-16T11:45:00Z" },
      { action: "Transferred Custody", by: "Det. Disha Gupta", to: "Sandhya Chandel (Analyst)", time: "2026-02-16T15:00:00Z" },
      { action: "Analysis Started", by: "Sandhya Chandel (Analyst)", time: "2026-02-17T09:00:00Z" }
    ]
  }
];

export default function CaseDetails() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const caseId = params.id as string;

  const [evidenceList, setEvidenceList] = useState(MOCK_EVIDENCE_DB);
  const [selectedEvidence, setSelectedEvidence] = useState<any | null>(null);

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);

  if (!user) return null;

  const handleNewEvidence = (newEvidence: any) => {
    setEvidenceList([{...newEvidence, custodyHistory: [{ action: "Registered", by: newEvidence.uploadedBy, time: newEvidence.timestamp }]}, ...evidenceList]);
  };

  return (
    <div className="min-h-screen bg-[#020617] pt-24 pb-12 px-4 sm:px-6 lg:px-8 flex gap-6">
      
      {/* Left Column: Evidence List & Uploader */}
      <div className="w-full lg:w-2/3 space-y-6">
        
        {/* Header */}
        <div className="bg-[#0f172a] border border-white/5 rounded-2xl p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] -mr-16 -mt-16 pointer-events-none" />
          
          <div className="flex items-center gap-2 text-sm text-slate-400 font-bold tracking-widest uppercase mb-4">
            <Link href="/cases" className="hover:text-white transition-colors">Cases</Link> 
            <ArrowRight size={14} /> 
            <span className="text-white">{caseId}</span>
          </div>

          <h1 className="text-3xl font-extrabold text-white mb-2">State vs. DOE - Financial Fraud</h1>
          <p className="text-slate-400 flex items-center gap-4">
            <span className="flex items-center gap-1"><Shield size={16} className="text-blue-500" /> Criminal Investigation</span>
            <span className="flex items-center gap-1"><UserCheck size={16} className="text-purple-500" /> Lead: Det. Sarah Jenkins</span>
          </p>
        </div>

        {/* The Wow Factor Evidence Uploader */}
        <EvidenceUploader caseId={caseId} onUploadComplete={handleNewEvidence} />

        {/* Existing Evidence Ledger */}
        <div className="bg-[#0f172a] border border-white/5 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <FolderClosed className="text-blue-500" size={24} />
              Vaulted Evidence
            </h3>
            
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input type="text" placeholder="Search by Hash or ID..." className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all w-64" />
            </div>
          </div>

          <div className="space-y-3">
            {evidenceList.map((ev) => (
              <div 
                key={ev.id} 
                onClick={() => setSelectedEvidence(ev)}
                className={`bg-white/[0.02] border border-white/5 rounded-xl p-4 hover:border-blue-500/30 cursor-pointer transition-all ${selectedEvidence?.id === ev.id ? 'border-blue-500 bg-blue-500/10' : ''}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-800 rounded-lg text-slate-400">
                      <Shield size={16} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{ev.fileName}</h4>
                      <p className="font-mono text-xs text-blue-400 tracking-wider bg-blue-900/20 px-2 py-0.5 rounded mt-1">{ev.id}</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-green-900/30 text-green-400 text-[10px] font-bold uppercase tracking-widest rounded border border-green-500/20">
                    {ev.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Right Column: Chain of Custody Timeline (The Verification) */}
      <div className="hidden lg:block w-1/3">
        <div className="bg-[#0f172a] border border-white/5 rounded-2xl p-6 sticky top-24 h-[calc(100vh-8rem)] overflow-y-auto">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Clock className="text-purple-500" size={24} />
            Chain of Custody
          </h3>

          {!selectedEvidence ? (
            <div className="h-64 flex flex-col items-center justify-center text-slate-500 text-center">
              <Shield size={48} className="mb-4 opacity-50" />
              <p>Select an evidence file to view its<br/>immutable audit trail.</p>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              
              <div className="mb-6 p-4 bg-black/40 border border-white/5 rounded-xl">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Active File</p>
                <p className="font-bold text-white truncate">{selectedEvidence.fileName}</p>
                
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-4 mb-1">SHA-256 Fingerprint</p>
                <div className="font-mono text-[10px] text-blue-400 bg-blue-500/10 p-2 rounded border border-blue-500/20 break-all leading-relaxed">
                  {selectedEvidence.hash}
                </div>
              </div>

              {/* Advanced Timeline UI */}
              <div className="relative pl-6 space-y-8 mt-8 border-l border-slate-700/50">
                {selectedEvidence.custodyHistory.map((history: any, idx: number) => (
                  <div key={idx} className="relative">
                    {/* Timeline Node */}
                    <div className="absolute left-[-31px] bg-[#0f172a] p-1">
                      <div className="h-3 w-3 rounded-full bg-blue-500 ring-4 ring-blue-500/20" />
                    </div>
                    
                    <div>
                      <span className="text-[10px] text-slate-500 font-mono block mb-1">
                        {new Date(history.time).toLocaleString()}
                      </span>
                      <p className="font-bold text-white text-sm">{history.action}</p>
                      <div className="mt-2 text-sm text-slate-400 bg-white/5 p-3 rounded-lg border border-white/5">
                        <p>By: <span className="text-slate-300 font-semibold">{history.by}</span></p>
                        {history.to && <p className="mt-1">To: <span className="text-blue-300 font-semibold">{history.to}</span></p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* RBAC Action Context */}
              {user.role === 'Custodian' && selectedEvidence.status === 'In Custody' && (
                <button className="w-full mt-8 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                  Log Evidence Transfer
                </button>
              )}
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
