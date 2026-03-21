import { ethers } from "ethers";
import EvidenceLockerABI from "@/lib/abi/EvidenceLocker.json";

// Contract address from environment variable
export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000";

// ───────── Provider / Signer / Contract Initialization ─────────

/**
 * Connect to MetaMask and return provider, signer, contract.
 * Must be called in the browser where window.ethereum is available.
 */
export const getContract = async () => {
  if (typeof window === "undefined" || !(window as any).ethereum) {
    throw new Error("MetaMask (window.ethereum) is not installed or accessible.");
  }

  await (window as any).ethereum.request({ method: "eth_requestAccounts" });

  const provider = new ethers.BrowserProvider((window as any).ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, EvidenceLockerABI, signer);

  return { provider, signer, contract };
};

/**
 * Connect MetaMask wallet and return the connected address.
 */
export const connectWallet = async (): Promise<string> => {
  if (typeof window === "undefined" || !(window as any).ethereum) {
    throw new Error("MetaMask is not installed.");
  }

  const accounts = await (window as any).ethereum.request({
    method: "eth_requestAccounts",
  });
  return accounts[0] as string;
};

/**
 * Get the currently connected wallet address without prompting.
 */
export const getConnectedAddress = async (): Promise<string | null> => {
  if (typeof window === "undefined" || !(window as any).ethereum) return null;

  try {
    const accounts = await (window as any).ethereum.request({
      method: "eth_accounts",
    });
    return accounts[0] || null;
  } catch {
    return null;
  }
};

// ───────── Contract Write Functions ─────────

/**
 * Register new evidence on-chain.
 * Returns the transaction receipt with txHash and blockNumber.
 */
export const registerEvidence = async (
  evidenceId: string,
  fileHash: string,
  ipfsCID: string,
  caseId: string
) => {
  const { contract } = await getContract();
  const tx = await contract.registerEvidence(evidenceId, caseId, fileHash, ipfsCID);
  const receipt = await tx.wait();
  return {
    txHash: receipt.hash,
    blockNumber: receipt.blockNumber,
  };
};

/**
 * Modify evidence on-chain with a new file hash and IPFS CID.
 */
export const modifyEvidence = async (
  evidenceId: string,
  newHash: string,
  newIpfsCID: string,
  note: string
) => {
  const { contract } = await getContract();
  const tx = await contract.modifyEvidence(evidenceId, newHash, newIpfsCID, note);
  const receipt = await tx.wait();
  return {
    txHash: receipt.hash,
    blockNumber: receipt.blockNumber,
  };
};

/**
 * Log an access event on-chain. User signs via MetaMask.
 */
export const logAccess = async (evidenceId: string) => {
  const { contract } = await getContract();
  const tx = await contract.accessEvidence(evidenceId);
  const receipt = await tx.wait();
  return {
    txHash: receipt.hash,
    blockNumber: receipt.blockNumber,
  };
};

/**
 * Grant access to a specific Ethereum address for an evidence item.
 */
export const grantAccess = async (evidenceId: string, toAddress: string) => {
  const { contract } = await getContract();
  const tx = await contract.grantAccess(evidenceId, toAddress);
  const receipt = await tx.wait();
  return {
    txHash: receipt.hash,
    blockNumber: receipt.blockNumber,
  };
};

// ───────── Contract Read Functions ─────────

/**
 * Fetch evidence data from the smart contract.
 */
export const getEvidenceData = async (evidenceId: string) => {
  const { contract } = await getContract();
  const data = await contract.getEvidenceData(evidenceId);
  return {
    evidenceId: data.evidenceId,
    caseId: data.caseId,
    fileHash: data.fileHash,
    ipfsCID: data.ipfsCID,
    timestamp: Number(data.timestamp),
    currentHolder: data.currentHolder,
    status: data.status,
    accessCount: Number(data.accessCount),
  };
};

/**
 * Fetch chain of custody logs from the smart contract.
 */
export const getChainOfCustodyData = async (evidenceId: string) => {
  const { contract } = await getContract();
  const logs = await contract.getChainOfCustodyData(evidenceId);
  return logs.map((log: any) => ({
    from: log.from,
    to: log.to,
    timestamp: Number(log.timestamp),
    action: log.action,
    note: log.note,
  }));
};

/**
 * Fetch all on-chain events for a specific evidence ID.
 * Queries EvidenceUploaded, EvidenceModified, EvidenceAccessed, AccessGranted events.
 */
export const getEvidenceHistory = async (evidenceId: string) => {
  const { contract, provider } = await getContract();

  // Get all events for this evidence ID
  const uploadFilter = contract.filters.EvidenceUploaded(ethers.id(evidenceId));
  const modifyFilter = contract.filters.EvidenceModified(ethers.id(evidenceId));
  const accessFilter = contract.filters.EvidenceAccessed(ethers.id(evidenceId));
  const grantFilter = contract.filters.AccessGranted(ethers.id(evidenceId));

  const [uploadEvents, modifyEvents, accessEvents, grantEvents] = await Promise.all([
    contract.queryFilter(uploadFilter),
    contract.queryFilter(modifyFilter),
    contract.queryFilter(accessFilter),
    contract.queryFilter(grantFilter),
  ]);

  return {
    uploads: uploadEvents.map((e: any) => ({
      fileHash: e.args?.fileHash,
      ipfsCID: e.args?.ipfsCID,
      uploaderAddress: e.args?.uploaderAddress,
      timestamp: Number(e.args?.timestamp),
      txHash: e.transactionHash,
      blockNumber: e.blockNumber,
    })),
    modifications: modifyEvents.map((e: any) => ({
      newHash: e.args?.newHash,
      newIpfsCID: e.args?.newIpfsCID,
      modifierAddress: e.args?.modifierAddress,
      timestamp: Number(e.args?.timestamp),
      note: e.args?.note,
      txHash: e.transactionHash,
      blockNumber: e.blockNumber,
    })),
    accesses: accessEvents.map((e: any) => ({
      accessorAddress: e.args?.accessorAddress,
      timestamp: Number(e.args?.timestamp),
      accessCountForUser: Number(e.args?.accessCountForUser),
      txHash: e.transactionHash,
      blockNumber: e.blockNumber,
    })),
    grants: grantEvents.map((e: any) => ({
      grantedTo: e.args?.grantedTo,
      grantedBy: e.args?.grantedBy,
      timestamp: Number(e.args?.timestamp),
      txHash: e.transactionHash,
      blockNumber: e.blockNumber,
    })),
  };
};
