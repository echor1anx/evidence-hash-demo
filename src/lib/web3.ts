import { ethers } from "ethers";
import { EVIDENCE_LOCKER_ABI } from "./contract-abi";

/**
 * Initialize blockchain contract instance
 * Uses the configured provider and contract address from environment variables
 */
export async function getContractInstance() {
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;
  const privateKey = process.env.PRIVATE_KEY;

  if (!contractAddress) {
    throw new Error(
      "NEXT_PUBLIC_CONTRACT_ADDRESS environment variable is not set"
    );
  }
  if (!rpcUrl) {
    throw new Error("NEXT_PUBLIC_RPC_URL environment variable is not set");
  }
  if (!privateKey) {
    throw new Error("PRIVATE_KEY environment variable is not set");
  }

  // Create provider from RPC URL
  const provider = new ethers.JsonRpcProvider(rpcUrl);

  // Create signer from private key
  const signer = new ethers.Wallet(privateKey, provider);

  // Create contract instance with signer to enable write operations
  const contract = new ethers.Contract(
    contractAddress,
    EVIDENCE_LOCKER_ABI,
    signer
  );

  return { contract, provider, signer };
}

/**
 * Register evidence on blockchain
 * Stores evidence ID, case ID, and file hash on-chain
 */
export async function registerEvidenceOnChain(
  evidenceId: string,
  caseId: string,
  fileHash: string
) {
  try {
    const { contract } = await getContractInstance();

    // Call registerEvidence function on smart contract
    const tx = await contract.registerEvidence(evidenceId, caseId, fileHash);

    // Wait for transaction confirmation
    const receipt = await tx.wait();

    console.log(
      `Evidence registered on blockchain. TX Hash: ${receipt.hash}`
    );

    return {
      success: true,
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber,
    };
  } catch (error: any) {
    console.error("Error registering evidence on blockchain:", error);
    throw new Error(`Blockchain registration failed: ${error.message}`);
  }
}

/**
 * Get evidence from blockchain
 * Retrieves evidence details stored on-chain
 */
export async function getEvidenceFromChain(evidenceId: string) {
  try {
    const { contract, provider } = await getContractInstance();

    // Call getEvidence function on smart contract
    const evidence = await contract.getEvidence(evidenceId);

    // Parse the result
    const [id, caseId, fileHash, timestamp, currentHolder, status] = evidence;

    return {
      evidenceId: id,
      caseId,
      fileHash,
      timestamp: BigInt(timestamp).toString(),
      currentHolder,
      status,
    };
  } catch (error: any) {
    console.error("Error retrieving evidence from blockchain:", error);
    throw new Error(`Failed to retrieve evidence: ${error.message}`);
  }
}

/**
 * Get chain of custody for evidence
 * Retrieves all custody transfers on-chain
 */
export async function getChainOfCustodyFromChain(evidenceId: string) {
  try {
    const { contract } = await getContractInstance();

    // Call getChainOfCustody function on smart contract
    const custodyLogs = await contract.getChainOfCustody(evidenceId);

    // Parse and format the results
    return custodyLogs.map((log: any) => ({
      from: log.from,
      to: log.to,
      timestamp: BigInt(log.timestamp).toString(),
      action: log.action,
    }));
  } catch (error: any) {
    console.error("Error retrieving custody chain from blockchain:", error);
    throw new Error(`Failed to retrieve custody chain: ${error.message}`);
  }
}

/**
 * Transfer custody of evidence on blockchain
 */
export async function transferCustodyOnChain(
  evidenceId: string,
  toAddress: string,
  action: string
) {
  try {
    const { contract } = await getContractInstance();

    // Validate Ethereum address
    if (!ethers.isAddress(toAddress)) {
      throw new Error("Invalid Ethereum address");
    }

    // Call transferCustody function on smart contract
    const tx = await contract.transferCustody(evidenceId, toAddress, action);

    // Wait for transaction confirmation
    const receipt = await tx.wait();

    console.log(`Custody transferred on blockchain. TX Hash: ${receipt.hash}`);

    return {
      success: true,
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber,
    };
  } catch (error: any) {
    console.error("Error transferring custody on blockchain:", error);
    throw new Error(`Custody transfer failed: ${error.message}`);
  }
}

/**
 * Assign a role in EvidenceLocker contract. This is useful to initialize investigator role for signer.
 */
export async function setRoleOnChain(role: 'investigator' | 'custodian' | 'auditor', userAddress: string, enabled = true) {
  try {
    const { contract } = await getContractInstance();

    if (!ethers.isAddress(userAddress)) {
      throw new Error('Invalid Ethereum address');
    }

    let tx;
    if (role === 'investigator') {
      tx = await contract.setInvestigator(userAddress, enabled);
    } else if (role === 'custodian') {
      tx = await contract.setCustodian(userAddress, enabled);
    } else {
      tx = await contract.setAuditor(userAddress, enabled);
    }

    const receipt = await tx.wait();
    return {
      success: true,
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber,
    };
  } catch (error: any) {
    console.error(`Error setting ${role} role on blockchain:`, error);
    throw new Error(`Role assignment failed: ${error.message}`);
  }
}

/**
 * Verify file hash on blockchain
 * Checks if a file hash matches what's stored on-chain
 */
export async function verifyEvidenceHash(
  evidenceId: string,
  fileHash: string
): Promise<boolean> {
  try {
    const evidence = await getEvidenceFromChain(evidenceId);
    return evidence.fileHash === fileHash;
  } catch (error) {
    console.error("Error verifying evidence hash:", error);
    return false;
  }
}
