"use client";

import { useEffect, useState, useCallback, use } from "react";
import {
  ShieldCheck, AlertTriangle, FileText, UploadCloud, Clock, Edit2, Loader2,
  Info, ExternalLink, RefreshCw, Eye, Download, Lock
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ModifyEvidenceModal from "@/components/ModifyEvidenceModal";
import { logAccess, getEvidenceHistory } from "@/lib/contract";
import { getIPFSUrl } from "@/lib/ipfs";
import { verifyOnChain } from "@/lib/sync";

export default function EvidenceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { user } = useAuth();

  const resolvedParams = use(params);
  const evidenceId = resolvedParams.id;

  const [evidenceData, setEvidenceData] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModifyModal, setShowModifyModal] = useState(false);

  // On-chain events
  const [onChainHistory, setOnChainHistory] = useState<any>(null);
  const [loadingChain, setLoadingChain] = useState(false);

  // IPFS file + integrity
  const [ipfsObjectUrl, setIpfsObjectUrl] = useState<string | null>(null);
  const [loadingFile, setLoadingFile] = useState(false);
  const [integrityStatus, setIntegrityStatus] = useState<"none" | "verified" | "tampered">("none");
  const [integrityDetails, setIntegrityDetails] = useState<{ computed: string; stored: string } | null>(null);

  // Chain verification
  const [chainSyncStatus, setChainSyncStatus] = useState<"idle" | "checking" | "synced" | "mismatch">("idle");
  const [chainSyncDetails, setChainSyncDetails] = useState<any>(null);

  // Access logging
  const [accessLogged, setAccessLogged] = useState(false);

  const fetchDetails = async () => {
    try {
      const res = await fetch(`/api/evidence/${evidenceId}`);
      if (!res.ok) {
        if (res.status === 401) router.push("/login");
        throw new Error("Failed to fetch evidence details");
      }
      const data = await res.json();
      setEvidenceData(data.evidence);
      setLogs(data.logs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Log access both on-chain (via MetaMask) and in MongoDB
  const logAccessEvent = async () => {
    if (accessLogged) return;
    try {
      // On-chain access log (requires MetaMask)
      await logAccess(evidenceId);
      setAccessLogged(true);
    } catch (err) {
      console.warn("On-chain access log skipped (MetaMask may not be connected):", err);
    }
    // MongoDB access log (always)
    try {
      await fetch(`/api/evidence/${evidenceId}/access`, { method: "POST" });
    } catch (err) {
      console.error("MongoDB access log failed:", err);
    }
  };

  // Fetch full on-chain history
  const fetchOnChainHistory = async () => {
    setLoadingChain(true);
    try {
      const history = await getEvidenceHistory(evidenceId);
      setOnChainHistory(history);
    } catch (err) {
      console.warn("Could not fetch on-chain history (contract may not be deployed yet):", err);
    } finally {
      setLoadingChain(false);
    }
  };

  // Fetch IPFS file and verify integrity
  const fetchAndVerifyIPFS = useCallback(async (cid: string, storedHash: string) => {
    if (!cid) return;
    setLoadingFile(true);
    setIntegrityStatus("none");
    try {
      const url = getIPFSUrl(cid);
      const res = await fetch(url);
      if (!res.ok) throw new Error("Could not fetch file from IPFS");

      const arrayBuffer = await res.arrayBuffer();

      // Compute SHA-256 of the fetched file
      const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const computedHash = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

      setIntegrityDetails({ computed: computedHash, stored: storedHash });

      if (computedHash === storedHash) {
        setIntegrityStatus("verified");
      } else {
        setIntegrityStatus("tampered");
      }

      // Create object URL for display/download
      const blob = new Blob([arrayBuffer]);
      setIpfsObjectUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error("IPFS fetch/verify failed:", err);
    } finally {
      setLoadingFile(false);
    }
  }, []);

  // "Verify on Chain" — compares MongoDB hash with on-chain hash
  const handleVerifyOnChain = async () => {
    if (!evidenceData?.hash) return;
    setChainSyncStatus("checking");
    try {
      const result = await verifyOnChain(evidenceId, evidenceData.hash);
      setChainSyncDetails(result);
      setChainSyncStatus(result.inSync ? "synced" : "mismatch");
    } catch (err: any) {
      console.error("Chain verification failed:", err);
      setChainSyncStatus("idle");
      alert("Could not verify on chain. Ensure MetaMask is connected to Sepolia and the contract is deployed.");
    }
  };

  useEffect(() => {
    if (user) {
      fetchDetails();
      logAccessEvent();
      fetchOnChainHistory();
    }
  }, [user, evidenceId]);

  // Once we have evidence data with an IPFS CID, fetch and verify
  useEffect(() => {
    if (evidenceData?.ipfsCID && evidenceData?.hash) {
      fetchAndVerifyIPFS(evidenceData.ipfsCID, evidenceData.hash);
    }
  }, [evidenceData, fetchAndVerifyIPFS]);

  if (loading) {
    return (
      <div className="flex justify-center items-center flex-1 h-screen">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  if (!evidenceData) {
    return <div className="p-8 text-center text-red-400">Evidence not found.</div>;
  }

  const canModify = user?.role === "Investigator" || user?.role === "Admin";
  const ipfsUrl = evidenceData.ipfsCID ? getIPFSUrl(evidenceData.ipfsCID) : null;
  const isImage = evidenceData.fileName && /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(evidenceData.fileName);
  const isPDF = evidenceData.fileName && /\.pdf$/i.test(evidenceData.fileName);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">

      {/* TAMPER ALERT — Full-width, non-dismissable */}
      {integrityStatus === "tampered" && (
        <div className="bg-red-500/10 border-2 border-red-500 p-6 rounded-2xl flex items-start gap-4 shadow-[0_0_40px_rgba(239,68,68,0.25)_inset]">
          <AlertTriangle className="text-red-500 shrink-0 mt-1" size={48} />
          <div>
            <h2 className="text-red-500 font-black text-2xl tracking-wide">⚠ TAMPERING DETECTED</h2>
            <p className="text-red-400 font-bold mt-1">This evidence has been altered outside the system.</p>
            <p className="text-red-300/80 text-sm mt-2">
              The file retrieved from IPFS does not match the cryptographic fingerprint registered on the blockchain.
              This file should NOT be used in legal proceedings.
            </p>
            {integrityDetails && (
              <div className="mt-4 space-y-2 text-xs font-mono">
                <div className="bg-red-950/40 p-2 rounded border border-red-500/30">
                  <span className="text-red-400 font-bold">Stored Hash: </span>
                  <span className="text-red-300 break-all">{integrityDetails.stored}</span>
                </div>
                <div className="bg-red-950/40 p-2 rounded border border-red-500/30">
                  <span className="text-red-400 font-bold">Computed Hash: </span>
                  <span className="text-red-300 break-all">{integrityDetails.computed}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <FileText className="text-blue-500" />
            Evidence: {evidenceData.evidenceId}
          </h1>
          <p className="text-slate-400 mt-2">File: {evidenceData.fileName}</p>
        </div>
        <div className="flex gap-3">
          {canModify && (
            <button
              onClick={() => setShowModifyModal(true)}
              className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 border border-white/10 transition-colors"
            >
              <Edit2 size={16} /> Modify Evidence
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT COL */}
        <div className="lg:col-span-2 space-y-6">

          {/* Cryptographic Identity */}
          <div className="bg-[#0f172a] rounded-2xl border border-white/10 p-6 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-4">Cryptographic Identity</h2>
            <div className="space-y-4">
              <div className="bg-black/40 p-3 rounded-lg flex flex-col gap-1">
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">SHA-256 Hash (On-Chain Record)</span>
                <span className="font-mono text-sm text-blue-300 break-all">{evidenceData.hash}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/40 p-3 rounded-lg">
                  <span className="text-xs text-slate-500 font-semibold uppercase">File Size</span>
                  <p className="text-white mt-1">{(evidenceData.fileSize / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <div className="bg-black/40 p-3 rounded-lg">
                  <span className="text-xs text-slate-500 font-semibold uppercase">Total Accesses</span>
                  <p className="text-white mt-1">{evidenceData.accessCount} views</p>
                </div>
              </div>

              {/* Blockchain fields */}
              {evidenceData.txHash && (
                <div className="bg-black/40 p-3 rounded-lg flex flex-col gap-1">
                  <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Transaction Hash</span>
                  <a
                    href={`https://sepolia.etherscan.io/tx/${evidenceData.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs text-emerald-400 break-all hover:text-emerald-300 flex items-center gap-1"
                  >
                    {evidenceData.txHash}
                    <ExternalLink size={12} className="ml-1 shrink-0" />
                  </a>
                </div>
              )}

              {evidenceData.ipfsCID && (
                <div className="bg-black/40 p-3 rounded-lg flex flex-col gap-1">
                  <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">IPFS CID</span>
                  <a
                    href={ipfsUrl!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs text-purple-400 break-all hover:text-purple-300 flex items-center gap-1"
                  >
                    {evidenceData.ipfsCID}
                    <ExternalLink size={12} className="ml-1 shrink-0" />
                  </a>
                </div>
              )}

              {evidenceData.blockNumber && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/40 p-3 rounded-lg">
                    <span className="text-xs text-slate-500 font-semibold uppercase">Block Number</span>
                    <p className="text-white mt-1 font-mono text-sm">{evidenceData.blockNumber}</p>
                  </div>
                  <div className="bg-black/40 p-3 rounded-lg">
                    <span className="text-xs text-slate-500 font-semibold uppercase">Algorithm</span>
                    <p className="text-white mt-1">{evidenceData.hashAlgorithm || "SHA-256"}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Integrity Status */}
          {evidenceData.ipfsCID && (
            <div className="bg-[#0f172a] rounded-2xl border border-white/10 p-6 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-2">Integrity Status</h2>
              <p className="text-sm text-slate-400 mb-4">File automatically fetched from IPFS and verified against the blockchain hash.</p>

              {loadingFile && (
                <div className="flex items-center gap-3 text-blue-400 py-4">
                  <Loader2 className="animate-spin" size={20} />
                  <span className="font-mono text-sm">Fetching from IPFS and verifying integrity...</span>
                </div>
              )}

              {!loadingFile && integrityStatus === "verified" && (
                <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-xl flex items-center gap-4">
                  <ShieldCheck className="text-green-400 shrink-0" size={32} />
                  <div>
                    <h3 className="text-green-400 font-bold text-lg">Integrity Verified ✓</h3>
                    <p className="text-green-300/80 text-sm">IPFS file hash matches blockchain record exactly.</p>
                    {integrityDetails && (
                      <p className="text-xs font-mono text-green-400/70 mt-1 break-all">{integrityDetails.computed}</p>
                    )}
                  </div>
                </div>
              )}

              {!loadingFile && integrityStatus === "none" && !loadingFile && (
                <div className="bg-slate-800/50 border border-white/10 p-4 rounded-xl text-slate-400 text-sm">
                  No IPFS file loaded yet. Refresh the page if this takes too long.
                </div>
              )}
            </div>
          )}

          {/* IPFS File Viewer */}
          {ipfsUrl && (
            <div className="bg-[#0f172a] rounded-2xl border border-white/10 p-6 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Eye className="text-blue-500" size={22} /> Evidence File (IPFS)
              </h2>

              {loadingFile ? (
                <div className="flex items-center gap-3 text-blue-400 py-8 justify-center">
                  <Loader2 className="animate-spin" size={24} />
                  <span>Loading from IPFS...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {isImage && ipfsObjectUrl && (
                    <div className="rounded-xl overflow-hidden border border-white/10 bg-black/40">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={ipfsObjectUrl} alt={evidenceData.fileName} className="max-w-full max-h-[500px] object-contain mx-auto" />
                    </div>
                  )}

                  {isPDF && ipfsObjectUrl && (
                    <iframe src={ipfsObjectUrl} className="w-full h-[500px] rounded-xl border border-white/10" title={evidenceData.fileName} />
                  )}

                  {!isImage && !isPDF && (
                    <div className="bg-black/40 rounded-xl border border-white/10 p-8 flex flex-col items-center gap-4">
                      <Lock className="text-slate-500" size={40} />
                      <p className="text-slate-300 font-medium">Binary / non-previewable file</p>
                      <p className="text-xs text-slate-500 font-mono">{evidenceData.fileName}</p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    {ipfsObjectUrl && (
                      <a
                        href={ipfsObjectUrl}
                        download={evidenceData.fileName}
                        className="flex-1 flex items-center justify-center gap-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-400 py-2.5 rounded-xl font-semibold text-sm transition-colors"
                      >
                        <Download size={16} /> Download from IPFS
                      </a>
                    )}
                    <a
                      href={ipfsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 py-2.5 rounded-xl font-semibold text-sm transition-colors"
                    >
                      <ExternalLink size={16} /> Open on Pinata Gateway
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Verify on Chain */}
          <div className="bg-[#0f172a] rounded-2xl border border-white/10 p-6 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-2">Verify on Chain</h2>
            <p className="text-sm text-slate-400 mb-4">
              Checks if the MongoDB record matches the on-chain data on Sepolia. Requires MetaMask.
            </p>

            <button
              onClick={handleVerifyOnChain}
              disabled={chainSyncStatus === "checking"}
              className="flex items-center gap-2 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-400 px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors disabled:opacity-50"
            >
              {chainSyncStatus === "checking" ? (
                <><Loader2 className="animate-spin" size={16} /> Querying Blockchain...</>
              ) : (
                <><RefreshCw size={16} /> Verify on Chain</>
              )}
            </button>

            {chainSyncStatus === "synced" && chainSyncDetails && (
              <div className="mt-4 bg-green-500/10 border border-green-500/30 p-4 rounded-xl">
                <div className="flex items-center gap-2 text-green-400 font-bold mb-2">
                  <ShieldCheck size={18} /> Records in sync ✓
                </div>
                <p className="text-xs text-green-300/80">On-chain hash matches database. Data is authentic.</p>
                <p className="text-xs font-mono text-green-400/60 mt-2 break-all">On-chain: {chainSyncDetails.onChainHash}</p>
              </div>
            )}

            {chainSyncStatus === "mismatch" && chainSyncDetails && (
              <div className="mt-4 bg-red-500/10 border border-red-500/30 p-4 rounded-xl">
                <div className="flex items-center gap-2 text-red-400 font-bold mb-2">
                  <AlertTriangle size={18} /> ⚠ Database record has been tampered with
                </div>
                <p className="text-xs text-red-300/80">The MongoDB hash does not match the immutable on-chain record.</p>
                <div className="mt-2 text-xs font-mono space-y-1">
                  <p className="text-red-400/70 break-all">DB hash: {evidenceData.hash}</p>
                  <p className="text-red-400/70 break-all">On-chain: {chainSyncDetails.onChainHash}</p>
                </div>
              </div>
            )}
          </div>

          {/* On-chain event history */}
          {onChainHistory && (
            <div className="bg-[#0f172a] rounded-2xl border border-white/10 p-6 shadow-xl space-y-4">
              <h2 className="text-xl font-bold text-white">On-Chain Event Log</h2>

              {onChainHistory.uploads?.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-2">Upload Events</h3>
                  {onChainHistory.uploads.map((ev: any, i: number) => (
                    <div key={i} className="bg-blue-500/5 border border-blue-500/20 p-3 rounded-xl mb-2 text-xs font-mono">
                      <p className="text-slate-300"><span className="text-blue-400">Hash:</span> {ev.fileHash}</p>
                      <p className="text-slate-300 mt-1"><span className="text-blue-400">CID:</span> {ev.ipfsCID}</p>
                      <p className="text-slate-400 mt-1"><span className="text-blue-400">By:</span> {ev.uploaderAddress}</p>
                      <p className="text-slate-400"><span className="text-blue-400">Block:</span> {ev.blockNumber}</p>
                    </div>
                  ))}
                </div>
              )}

              {onChainHistory.modifications?.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-amber-400 uppercase tracking-widest mb-2">Modification Events</h3>
                  {onChainHistory.modifications.map((ev: any, i: number) => (
                    <div key={i} className="bg-amber-500/5 border border-amber-500/20 p-3 rounded-xl mb-2 text-xs font-mono">
                      <p className="text-slate-300"><span className="text-amber-400">New Hash:</span> {ev.newHash}</p>
                      <p className="text-slate-300 mt-1"><span className="text-amber-400">New CID:</span> {ev.newIpfsCID}</p>
                      <p className="text-slate-400 mt-1"><span className="text-amber-400">By:</span> {ev.modifierAddress}</p>
                      <p className="text-slate-300 mt-1"><span className="text-amber-400">Note:</span> {ev.note}</p>
                      <p className="text-slate-400"><span className="text-amber-400">Block:</span> {ev.blockNumber}</p>
                    </div>
                  ))}
                </div>
              )}

              {onChainHistory.accesses?.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-purple-400 uppercase tracking-widest mb-2">Access Events</h3>
                  {onChainHistory.accesses.map((ev: any, i: number) => (
                    <div key={i} className="bg-purple-500/5 border border-purple-500/20 p-3 rounded-xl mb-2 text-xs font-mono">
                      <p className="text-slate-300"><span className="text-purple-400">By:</span> {ev.accessorAddress}</p>
                      <p className="text-slate-400"><span className="text-purple-400">Access #{ev.accessCountForUser} by this user</span></p>
                      <p className="text-slate-400"><span className="text-purple-400">Block:</span> {ev.blockNumber}</p>
                    </div>
                  ))}
                </div>
              )}

              {onChainHistory.uploads?.length === 0 && onChainHistory.modifications?.length === 0 && (
                <p className="text-slate-500 text-sm italic">No on-chain events found. Contract may not be deployed yet.</p>
              )}
            </div>
          )}
        </div>

        {/* RIGHT COL: Chain of Custody Timeline */}
        <div className="bg-[#0f172a] rounded-2xl border border-white/10 p-6 shadow-xl lg:h-fit flex flex-col">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Clock className="text-blue-500" />
            Chain of Custody
          </h2>

          <div className="flex-1 overflow-y-auto pr-1 space-y-6">
            {logs.map((log, idx) => {
              const isUpload = log.action === "Uploaded";
              const isModify = log.action === "Modified";
              const isAccess = log.action === "Accessed";

              let bgColor = "bg-slate-800/50 border-white/5";
              let dotColor = "bg-slate-500";
              let labelColor = "text-slate-300";

              if (isUpload) { bgColor = "bg-blue-500/10 border-blue-500/20"; dotColor = "bg-blue-400"; labelColor = "text-blue-400"; }
              if (isModify) { bgColor = "bg-amber-500/10 border-amber-500/20"; dotColor = "bg-amber-400"; labelColor = "text-amber-400"; }
              if (isAccess) { bgColor = "bg-white/5 border-white/5"; dotColor = "bg-slate-400"; labelColor = "text-slate-300"; }

              return (
                <div key={log._id} className="relative pl-6 pb-2">
                  {idx !== logs.length - 1 && (
                    <div className="absolute left-[9px] top-6 bottom-[-24px] w-[2px] bg-white/10" />
                  )}
                  <div className={`absolute left-0 top-1.5 w-[20px] h-[20px] rounded-full border-4 border-[#0f172a] ${dotColor} z-10`} />

                  <div className={`p-4 rounded-xl border ${bgColor} transition-colors`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className={`font-bold text-sm ${labelColor}`}>{log.action}</span>
                      <span className="text-xs text-slate-500 font-mono">
                        {new Date(log.timestamp).toLocaleDateString()}{" "}
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className="text-white text-sm font-medium">{log.performedBy?.name}</p>
                    <p className="text-slate-400 text-xs">{log.performedBy?.role}</p>
                    {log.notes && (
                      <div className="mt-3 bg-black/30 p-2 rounded text-xs text-slate-300 border border-white/5">
                        <Info size={12} className="inline mr-1 text-slate-500 mb-0.5" />
                        {log.notes}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {logs.length === 0 && (
              <p className="text-slate-500 text-sm italic text-center py-8">No custody logs found.</p>
            )}
          </div>
        </div>
      </div>

      {showModifyModal && (
        <ModifyEvidenceModal
          evidenceId={evidenceId}
          onClose={() => setShowModifyModal(false)}
          onSuccess={(newHash, newCID) => {
            alert(`Successfully modified on-chain!\nNew Hash: ${newHash}\nNew IPFS CID: ${newCID}`);
            fetchDetails();
          }}
        />
      )}
    </div>
  );
}
