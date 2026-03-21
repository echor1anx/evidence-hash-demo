# Blockchain Integration Setup Guide

This project now includes blockchain integration using the Ethereum network and smart contracts for immutable evidence chain of custody.

## Prerequisites

1. **MetaMask or Ethereum Wallet** - To deploy contracts and fund the deployment account
2. **Ethers.js** - Already installed via npm
3. **Test Network Funds** - ETH on Sepolia testnet (free from faucets)

## Step 1: Deploy the Smart Contract

The `EvidenceLocker.sol` contract needs to be deployed to a blockchain network.

### Option A: Using Remix IDE (Easiest for Testing)

1. Go to https://remix.ethereum.org
2. Create new file: `EvidenceLocker.sol`
3. Copy the contract code from `contracts/EvidenceLocker.sol`
4. Compile: Click "Compile" in the left panel
5. Deploy to Sepolia testnet:
   - Select "Injected Web3" environment (connects MetaMask)
   - Make sure MetaMask is on Sepolia testnet
   - Click "Deploy"
   - Approve transaction in MetaMask
6. Copy the deployed contract address

### Option B: Using Hardhat (Production-Ready)

```bash
# Install Hardhat
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox

# Initialize Hardhat project
npx hardhat

# Create deployment script in scripts/deploy.js
# Run deployment
npx hardhat run scripts/deploy.js --network sepolia
```

## Step 2: Configure Environment Variables

Update `.env.local` with your blockchain configuration:

```env
# RPC URL for Sepolia testnet (you need an Infura/Alchemy key)
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY

# Deployed contract address from Step 1
NEXT_PUBLIC_CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890

# Private key of account with funds (for writing to blockchain)
# ⚠️ NEVER commit this to git! Use only for development/testing
PRIVATE_KEY=0xYOUR_PRIVATE_KEY_WITHOUT_0x_PREFIX
```

### Getting Infura Key:

1. Go to https://infura.io
2. Sign up (free)
3. Create new API Key for Sepolia
4. Copy the RPC URL

### Getting Sepolia Test ETH:

1. Go to https://faucets.chain.link/sepolia
2. Enter your wallet address
3. Request test ETH (takes a few minutes to arrive)

### Getting Private Key:

1. In MetaMask: Click account → Settings → Advanced → Export Private Key
2. ⚠️ **KEEP THIS SECRET** - Never share or commit to git!

## Step 3: Test the Integration

### Test Endpoint:

```bash
# Create a case with evidence - it will automatically register on blockchain
POST /api/cases
{
  "title": "Test Case",
  "description": "Testing blockchain integration",
  "evidence": [
    {
      "fileName": "evidence.txt",
      "fileSize": 1024,
      "hashAlgorithm": "SHA-256",
      "hash": "abc123def456ghi789jkl012mno345pqr678stu901vwx234yz"
    }
  ]
}
```

### Verify on BlockExplorer:

1. Go to https://sepolia.etherscan.io
2. Search for your contract address
3. View transactions and events

## Step 4: Add Contract Interaction UI (Optional)

Create a dashboard component to:
- View evidence on blockchain
- Verify file hashes
- Track custody transfers
- View transaction details

## Security Notes

1. **Private Key Security**:
   - Use a dedicated account for testing only
   - Keep the private key in `.env.local` (never commit)
   - Consider using environment variables from deployment platform

2. **Test Network Only**:
   - For production, deploy to Ethereum mainnet or Layer 2
   - Mainnet has real costs - use caution

3. **Contract Upgrades**:
   - Consider using proxy patterns for production
   - Implement access control for sensitive functions

## Troubleshooting

### "Connection refused" error:
- Check RPC URL is correct
- Verify Infura key is valid
- Check network is Sepolia (not mainnet)

### "Insufficient funds" error:
- Get free test ETH from Sepolia faucet
- Ensure private key account has the funds

### "Contract address not found" error:
- Verify contract is deployed to correct network
- Check contract address in `.env.local` is correct

### "Function doesn't exist" error:
- Ensure you deployed the correct contract
- Contract ABI in `src/lib/contract-abi.ts` must match deployed contract

## Next Steps

1. Deploy contract to testnet
2. Update `.env.local` with contract details
3. Add test ETH to your account
4. Test evidence upload - should register on blockchain
5. View transactions on BlockExplorer

## API Integration Points

The blockchain integration is active in these API routes:

- **POST `/api/cases`** - Registers evidence on blockchain when case is created
- **GET `/api/cases`** - Includes blockchain transaction hashes in evidence data

Functions in `src/lib/web3.ts`:
- `registerEvidenceOnChain()` - Register new evidence
- `getEvidenceFromChain()` - Query evidence from blockchain
- `getChainOfCustodyFromChain()` - Get custody history
- `transferCustodyOnChain()` - Transfer evidence custody
- `verifyEvidenceHash()` - Verify file integrity

