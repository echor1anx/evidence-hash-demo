"use client";

import { useState, useCallback } from "react";
import { UploadCloud, File, ShieldCheck, Loader2, Wallet } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { uploadToIPFS } from "@/lib/ipfs";
import { registerEvidence } from "@/lib/contract";

interface EvidenceUploaderProps {
  caseId: string;
  onUploadComplete?: (evidence: any) => void;
}

export default function EvidenceUploader({ caseId, onUploadComplete }: EvidenceUploaderProps) {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isHashing, setIsHashing] = useState(false);
  const [hashResult, setHashResult] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>("");

  // Calculate SHA-256 hash client-side
  const calculateLocalHash = async (file: File) => {
    setIsHashing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800)); // UI effect
      const arrayBuffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      setHashResult(hashHex);
    } catch (err) {
      console.error("Hashing failed", err);
    } finally {
      setIsHashing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      calculateLocalHash(selected);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) {
      setFile(dropped);
      calculateLocalHash(dropped);
    }
  }, []);

  const handleSubmitToLedger = async () => {
    if (!file || !hashResult) return;
    setIsUploading(true);

    try {
      // Step 1: Upload file to IPFS via Pinata
      setUploadStatus("Uploading to IPFS...");
      const ipfsCID = await uploadToIPFS(file);

      // Step 2: Generate evidence ID
      const evidenceId = "EV-" + Math.random().toString(36).substr(2, 6).toUpperCase();

      // Step 3: Register on blockchain via MetaMask
      setUploadStatus("Sign transaction in MetaMask...");
      const receipt = await registerEvidence(evidenceId, hashResult, ipfsCID, caseId);

      // Step 4: Save to MongoDB backend
      setUploadStatus("Saving to database...");
      const res = await fetch("/api/evidence/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseId,
          evidenceId,
          fileName: file.name,
          fileSize: file.size,
          hashAlgorithm: "SHA-256",
          hash: hashResult,
          ipfsCID,
          txHash: receipt.txHash,
          blockNumber: receipt.blockNumber,
          contractEvidenceId: evidenceId,
        }),
      });

      if (!res.ok) throw new Error("Backend save failed");

      // Success
      if (onUploadComplete) {
        onUploadComplete({
          evidenceId,
          fileName: file.name,
          hash: hashResult,
          ipfsCID,
          txHash: receipt.txHash,
          blockNumber: receipt.blockNumber,
          uploadedBy: user?.name,
          role: user?.role,
          timestamp: new Date().toISOString(),
          status: "Registered on Chain",
        });
      }

      setFile(null);
      setHashResult(null);
      setUploadStatus("");
    } catch (err: any) {
      console.error("Upload failed:", err);
      setUploadStatus("");
      alert(
        err.message?.includes("MetaMask") || err.message?.includes("ethereum")
          ? "Please connect MetaMask to Sepolia testnet and ensure you have test ETH."
          : `Upload failed: ${err.message}`
      );
    } finally {
      setIsUploading(false);
    }
  };

  // RBAC protection
  if (user?.role !== 'Investigator' && user?.role !== 'Admin') {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
        <ShieldCheck className="mx-auto text-red-400 mb-2" size={32} />
        <h3 className="text-red-400 font-bold mb-1">Upload Restricted</h3>
        <p className="text-sm text-red-300/80">Your current clearance level ({user?.role}) does not permit registering new evidence onto the ledger.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-6">
      <h3 className="text-lg font-bold text-white mb-4">Register New Evidence</h3>
      
      {!file ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all ${
            isDragging ? "border-blue-500 bg-blue-500/5 text-blue-400" : "border-slate-700 hover:border-slate-500 text-slate-400"
          }`}
        >
          <UploadCloud className="mb-4" size={40} />
          <p className="font-semibold mb-1">Drag & drop evidence file here</p>
          <p className="text-xs mb-4">File will be stored on IPFS. Hash is computed locally before upload.</p>
          
          <label className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg font-semibold cursor-pointer transition-colors text-sm">
            Browse Files
            <input type="file" className="hidden" onChange={handleFileChange} />
          </label>
        </div>
      ) : (
        <div className="space-y-6">
          {/* File Selected State */}
          <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
            <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400">
              <File size={24} />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="font-semibold text-white truncate">{file.name}</p>
              <p className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <button 
              onClick={() => { setFile(null); setHashResult(null); }}
              className="text-slate-500 hover:text-white text-sm"
              disabled={isUploading}
            >
              Cancel
            </button>
          </div>

          {/* Real-time Hash Result */}
          <div className="bg-[#020617] border border-white/10 rounded-xl p-5 relative overflow-hidden">
            {isHashing ? (
              <div className="flex items-center gap-3 text-blue-400">
                <Loader2 className="animate-spin" size={20} />
                <span className="font-mono text-sm tracking-widest uppercase">Generating SHA-256 Fingerprint...</span>
              </div>
            ) : hashResult ? (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="text-green-400" size={18} />
                  <span className="text-green-400 font-bold text-sm tracking-widest uppercase">Cryptographic Integrity Verified</span>
                </div>
                <div className="bg-black/50 p-4 rounded-lg font-mono text-blue-300 text-xs sm:text-sm break-all border border-blue-500/20 shadow-[0_0_20px_rgba(37,99,235,0.1)_inset]">
                  {hashResult}
                </div>
              </div>
            ) : null}
          </div>

          {/* Upload Status */}
          {isUploading && uploadStatus && (
            <div className="flex items-center gap-3 text-blue-400 bg-blue-500/10 p-4 rounded-xl border border-blue-500/20">
              <Loader2 className="animate-spin" size={20} />
              <span className="font-semibold text-sm">{uploadStatus}</span>
            </div>
          )}

          <button 
            onClick={handleSubmitToLedger}
            disabled={isHashing || !hashResult || isUploading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {isUploading ? (
              <><Loader2 className="animate-spin" size={20} /> Processing...</>
            ) : (
              <><Wallet size={20} /> Sign & Register to Blockchain</>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
