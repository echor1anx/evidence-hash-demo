# Blockchain Integration - Developer Guide

## Quick Reference

### Core Functions

#### Register Evidence on Blockchain
```typescript
import { registerEvidenceOnChain } from "@/lib/web3";

const result = await registerEvidenceOnChain(
  evidenceId,      // "EV-12345678-0-abc123"
  caseId,          // Case MongoDB ID
  fileHash         // SHA-256 hash of file
);

// Returns:
// {
//   success: true,
//   transactionHash: "0x1234...",
//   blockNumber: 4567890
// }
```

#### Retrieve Evidence from Blockchain
```typescript
import { getEvidenceFromChain } from "@/lib/web3";

const evidence = await getEvidenceFromChain("EV-12345678-0-abc123");

// Returns:
// {
//   evidenceId: "EV-12345678-0-abc123",
//   caseId: "507f1f77bcf86cd799439011",
//   fileHash: "abc123...",
//   timestamp: "1710777600",
//   currentHolder: "0x1234...",
//   status: "Registered"
// }
```

#### Get Custody History
```typescript
import { getChainOfCustodyFromChain } from "@/lib/web3";

const custody = await getChainOfCustodyFromChain("EV-12345678-0-abc123");

// Returns array of:
// {
//   from: "0x0000...",
//   to: "0x5678...",
//   timestamp: "1710777600",
//   action: "Initial Registration"
// }
```

#### Verify File Hash
```typescript
import { verifyEvidenceHash } from "@/lib/web3";

const isValid = await verifyEvidenceHash(
  "EV-12345678-0-abc123",
  "abc123def456..."
);

// Returns: true or false
```

---

## Integration Example

### Adding Blockchain Verification to a Component

```typescript
'use client';

import { useState } from 'react';
import BlockchainVerification from '@/components/BlockchainVerification';

export default function EvidenceDetail({ evidence }) {
  return (
    <div>
      <h2>{evidence.fileName}</h2>
      <p>Hash: {evidence.hash}</p>
      
      {/* Show blockchain verification if on-chain */}
      {evidence.blockchainTxHash && (
        <BlockchainVerification
          txHash={evidence.blockchainTxHash}
          evidenceId={evidence.evidenceId}
        />
      )}
    </div>
  );
}
```

### API Endpoint Pattern

```typescript
// src/app/api/custom/route.ts
import { registerEvidenceOnChain } from '@/lib/web3';

export async function POST(req: NextRequest) {
  try {
    const { evidence } = await req.json();
    
    // Your logic here...
    
    // Register on blockchain
    const result = await registerEvidenceOnChain(
      evidence.id,
      evidence.caseId,
      evidence.hash
    );
    
    // Save transaction hash
    await updateDatabase({
      blockchainTxHash: result.transactionHash
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

---

## Understanding the Contract

### Evidence Struct
```solidity
struct Evidence {
  string evidenceId;           // Unique identifier
  string caseId;               // Link to case
  string fileHash;             // SHA-256 hash
  uint256 timestamp;           // When registered
  address currentHolder;       // Current custodian
  string status;               // "Registered", "In Custody", etc.
}
```

### Key Events
- **EvidenceRegistered**: Fired when evidence added to blockchain
- **CustodyTransferred**: Fired when custody changes

### Contract Functions
```solidity
// Write functions (cost gas)
registerEvidence(evidenceId, caseId, fileHash)
transferCustody(evidenceId, toAddress, action)

// Read functions (free, no gas)
getEvidence(evidenceId) → Evidence
getChainOfCustody(evidenceId) → CustodyLog[]
```

---

## Environment Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `NEXT_PUBLIC_RPC_URL` | Blockchain node RPC | `https://sepolia.infura.io/v3/...` |
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | Deployed contract | `0x1234567890123456789...` |
| `PRIVATE_KEY` | Account for transactions | `0xabc123...` |

---

## Error Handling

```typescript
try {
  const result = await registerEvidenceOnChain(id, caseId, hash);
} catch (error) {
  // Connection error
  if (error.message.includes('connection')) {
    // RPC URL issue or network down
  }
  
  // Config error
  if (error.message.includes('not set')) {
    // Missing environment variables
  }
  
  // Contract error
  if (error.message.includes('revert')) {
    // Contract execution failed (permissions, etc.)
  }
}
```

---

## Gas Optimization

Each blockchain operation costs gas:
- **Register Evidence**: ~80,000 gas (~$0.50 on testnet)
- **Transfer Custody**: ~60,000 gas
- **Query Evidence**: FREE (read-only)

Use read functions when possible to save costs.

---

## Testing

### Test with Mock Data
```typescript
// src/lib/web3.test.ts
import { verifyEvidenceHash } from './web3';

const mockHash = 'abc123def456ghi789...';
const result = await verifyEvidenceHash('EV-TEST', mockHash);
```

### Test API Endpoint
```bash
curl -X POST http://localhost:3000/api/blockchain/verify \
  -H "Content-Type: application/json" \
  -d '{"evidenceId":"EV-TEST"}'
```

---

## Debugging

### Enable Logging
```typescript
// In web3.ts functions
console.log('Transaction hash:', tx.hash);
console.log('Block number:', receipt.blockNumber);
console.log('Evidence:', evidence);
```

### Check on Block Explorer
Visit: `https://sepolia.etherscan.io/tx/TX_HASH`

### Verify Contract
- Network: Sepolia
- Status: Should be "Verified" after deployment
- Functions: Should be readable with inputs/outputs

---

## Best Practices

1. **Always catch blockchain errors** - Network can be slow/unavailable
2. **Store transaction hashes** - For audit trail and troubleshooting
3. **Use test network first** - Never test on mainnet with real funds
4. **Verify data before storing** - Check hashes match before saving
5. **Log all operations** - For debugging and compliance

---

## Common Issues & Solutions

### "Contract code is not available"
→ Contract not deployed to network
→ Check contract address matches deployment network

### "Insufficient balance for gas"
→ Account needs ETH for gas fees
→ Get free testnet ETH from faucet

### "Function not found"
→ ABI doesn't match deployed contract
→ Redeploy contract or update ABI

### "Connection timeout"
→ RPC service down or overloaded
→ Try different RPC provider (Alchemy, Infura, etc.)

---

## Performance

- **Registration**: 10-30 seconds per evidence
- **Query**: <1 second (depends on RPC provider)
- **Finality**: ~12 seconds (1 block) on Ethereum

Consider batch operations for better performance with many items.

---

## Next Advanced Features

- Batch register multiple evidence items
- Support multiple blockchain networks
- Implement contract upgrades with Proxy pattern
- Add signature verification for transactions
- Integrate with hardware wallets
- Multi-signature approval system

