"use client";

import { useState, useCallback } from "react";
import { UploadCloud, File, ShieldCheck, Loader2, X, Wallet } from "lucide-react";
import { modifyEvidence } from "@/lib/contract";
import { uploadToIPFS } from "@/lib/ipfs";
import { useAuth } from "@/context/AuthContext";

export default function ModifyEvidenceModal({ 
  evidenceId, 
  onClose, 
  onSuccess 
}: { 
  evidenceId: string; 
  onClose: () => void;
  onSuccess: (newHash: string, newCID: string) => void;
}) {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [isHashing, setIsHashing] = useState(false);
  const [hashResult, setHashResult] = useState<string | null>(null);
  const [isTransacting, setIsTransacting] = useState(false);
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("");

  const calculateLocalHash = async (file: File) => {
    setIsHashing(true);
    try {
      await new Promise(r => setTimeout(r, 600));
      const arrayBuffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      setHashResult(hashHex);
    } catch (err) {
      console.error(err);
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
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) {
      setFile(dropped);
      calculateLocalHash(dropped);
    }
  }, []);

  const handleModify = async () => {
    if (!file || !hashResult || !note) return;
    setIsTransacting(true);
    try {
      // 1. Upload new file to IPFS
      setStatus("Uploading to IPFS...");
      const newCID = await uploadToIPFS(file);

      // 2. Smart contract interaction via MetaMask
      setStatus("Sign transaction in MetaMask...");
      const receipt = await modifyEvidence(evidenceId, hashResult, newCID, note);

      // 3. Backend API update (MongoDB cache)
      setStatus("Updating database...");
      const res = await fetch(`/api/evidence/${evidenceId}/modify`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          newHash: hashResult, 
          newFileName: file.name, 
          newFileSize: file.size,
          newIpfsCID: newCID,
          txHash: receipt.txHash,
          blockNumber: receipt.blockNumber,
          note,
        })
      });

      if (!res.ok) throw new Error("Backend update failed");

      onSuccess(hashResult, newCID);
      onClose();
    } catch (error: any) {
      console.error(error);
      alert(
        error.message?.includes("MetaMask") || error.message?.includes("ethereum")
          ? "Please connect MetaMask to Sepolia testnet and ensure you have test ETH."
          : `Modification failed: ${error.message}`
      );
    } finally {
      setIsTransacting(false);
      setStatus("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-6 w-full max-w-xl shadow-2xl relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-slate-400 hover:text-white" disabled={isTransacting}>
          <X />
        </button>

        <h2 className="text-xl font-bold text-white mb-6">Modify Evidence Form</h2>

        {!file ? (
          <div
            onDragOver={(e) => { e.preventDefault(); }}
            onDrop={handleDrop}
            className="border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-xl p-8 flex flex-col items-center cursor-pointer transition-colors"
          >
             <UploadCloud className="mb-4 text-slate-400" size={40} />
             <p className="font-semibold text-white mb-2">Drop new evidence replacement</p>
             <label className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer text-sm">
                Browse Files
                <input type="file" className="hidden" onChange={handleFileChange} />
             </label>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                <File className="text-blue-400" />
                <div className="flex-1 overflow-hidden">
                    <p className="font-semibold text-white truncate">{file.name}</p>
                    <p className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
            </div>

            {isHashing && <p className="text-sm text-blue-400 animate-pulse flex items-center gap-2"><Loader2 className="animate-spin" size={16}/> Generating Hash...</p>}
            
            {hashResult && (
                <div className="bg-black/50 p-3 rounded-lg border border-green-500/20 text-green-400 font-mono text-xs break-all">
                    Computed SHA-256: {hashResult}
                </div>
            )}

            <div>
                <label className="text-sm text-slate-400 mb-1 block">Modification Note (Required)</label>
                <textarea 
                    className="w-full bg-[#020617] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 text-sm h-24"
                    placeholder="Reason for modifying this evidence..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                />
            </div>

            {/* Status indicator */}
            {isTransacting && status && (
              <div className="flex items-center gap-3 text-blue-400 bg-blue-500/10 p-3 rounded-xl border border-blue-500/20">
                <Loader2 className="animate-spin" size={16} />
                <span className="text-sm font-semibold">{status}</span>
              </div>
            )}

            <button 
                onClick={handleModify}
                disabled={!hashResult || isTransacting || !note}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl flex justify-center items-center gap-2 transition-colors"
            >
                {isTransacting ? (
                  <><Loader2 className="animate-spin"/> Processing...</>
                ) : (
                  <><Wallet size={18} /> Sign & Update on Blockchain</>
                )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
