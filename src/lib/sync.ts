/**
 * sync.ts — Blockchain ↔ MongoDB Synchronization Utility
 *
 * syncFromChain(evidenceId) — Rebuilds a MongoDB evidence record from blockchain events alone.
 * Useful for disaster recovery or audit verification when the DB record is suspect/missing.
 */
import { getEvidenceHistory, getEvidenceData } from "@/lib/contract";

export interface SyncResult {
  success: boolean;
  evidenceId: string;
  restoredData?: {
    hash: string;
    ipfsCID: string;
    uploaderAddress: string;
    uploadTimestamp: number;
    txHash: string;
    blockNumber: number;
    modifications: any[];
    accesses: any[];
  };
  error?: string;
}

/**
 * Fetch all on-chain events for an evidence ID and rebuild the MongoDB record.
 * This calls backend API to update MongoDB from blockchain truth.
 *
 * @param evidenceId - The evidence ID (matches on-chain ID)
 * @param caseId - The MongoDB case ID to update
 * @returns SyncResult with the rebuilt data or error
 */
export async function syncFromChain(evidenceId: string, caseId: string): Promise<SyncResult> {
  try {
    // 1. Fetch all on-chain events
    const history = await getEvidenceHistory(evidenceId);

    if (!history.uploads || history.uploads.length === 0) {
      return {
        success: false,
        evidenceId,
        error: "No EvidenceUploaded event found on-chain for this ID.",
      };
    }

    // 2. The original upload event
    const originalUpload = history.uploads[0];

    // 3. The latest modification (if any)
    const latestMod = history.modifications[history.modifications.length - 1];

    // 4. Determine current hash and CID
    const currentHash = latestMod?.newHash || originalUpload.fileHash;
    const currentCID = latestMod?.newIpfsCID || originalUpload.ipfsCID;

    const restoredData = {
      hash: currentHash,
      ipfsCID: currentCID,
      uploaderAddress: originalUpload.uploaderAddress,
      uploadTimestamp: originalUpload.timestamp,
      txHash: originalUpload.txHash,
      blockNumber: originalUpload.blockNumber,
      modifications: history.modifications,
      accesses: history.accesses,
    };

    // 5. Push the restored data back to MongoDB via API
    const res = await fetch(`/api/evidence/${evidenceId}/sync`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        caseId,
        evidenceId,
        hash: currentHash,
        ipfsCID: currentCID,
        txHash: originalUpload.txHash,
        blockNumber: originalUpload.blockNumber,
        onChainTimestamp: originalUpload.timestamp,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return {
        success: false,
        evidenceId,
        error: err.error || "Failed to sync to MongoDB",
      };
    }

    return { success: true, evidenceId, restoredData };
  } catch (err: any) {
    return {
      success: false,
      evidenceId,
      error: err.message || "Unknown sync error",
    };
  }
}

/**
 * Verifies that the MongoDB hash matches the on-chain hash.
 * Used by the "Verify on Chain" button.
 */
export async function verifyOnChain(evidenceId: string, mongoDbHash: string): Promise<{
  inSync: boolean;
  onChainHash: string;
  onChainCID: string;
  onChainTimestamp: number;
}> {
  const onChainData = await getEvidenceData(evidenceId);
  return {
    inSync: onChainData.fileHash === mongoDbHash,
    onChainHash: onChainData.fileHash,
    onChainCID: onChainData.ipfsCID,
    onChainTimestamp: onChainData.timestamp,
  };
}
