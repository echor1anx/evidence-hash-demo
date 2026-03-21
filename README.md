# CUSTODY.chain - Blockchain Evidence Management System

A state-of-the-art forensic digital evidence management platform built to enforce a strict, transparent, and immutable **Chain of Custody**. By leveraging **Next.js**, **MongoDB**, and **Ethereum Smart Contracts (Solidity)**, this system ensures that every interaction with digital evidence is cryptographically verified and indelibly recorded on the blockchain.

## Features

- **Role-Based Access Control (RBAC):** Five distinct clearances (Admin, Investigator, Custodian, Analyst, Auditor), each offering a beautifully tailored, secure dashboard layout.
- **Immutable Timeline:** Every evidence interaction (Uploaded, Checked Out, Transferred, Verified, Checked In) is mapped chronologically in an un-editable Chain of Custody log tied directly to an on-chain verification hash. 
- **Auto-Incrementing Case Identification:** Cases intuitively initialize starting from `CAS-1` and strictly track assignment flows.
- **Dynamic Case Transfers:** Transfer evidence logs directly to specific forensic analysts or investigators in the system utilizing intuitive selection dropdowns. Doing so automatically grants them clearance to the case ledger in their dashboards.
- **Client-Side Cryptographic Hashing:** Advanced in-browser SHA-256 evidence hashing capabilities for verifying the integrity of physical or digital assets against the blockchain without ever uploading sensitive files to a central server.
- **Stunning Dark Mode Aesthetic:** Glassmorphism UI, fluid micro-animations, color-coordinated entity badges, and gradient styling meticulously designed for a premium user experience.

## Technology Stack

- **Frontend:** Next.js 14, React, Tailwind CSS 4, Framer Motion, Lucide React
- **Backend / Database:** Next.js Route Handlers, MongoDB (Mongoose)
- **Authentication:** Custom JWT Authorization (`jose`), bcrypt password hashing
- **Blockchain / Web3:** Ethers.js, Solidity (Deployed on Sepolia Testnet)

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/echor1anx/evidence-hash-demo.git
   cd evidence-hash-demo
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup (`.env.local`):**
   ```env
   # MongoDB Database
   MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/your-db
   
   # JWT & Security
   JWT_SECRET=your-secure-secret
   
   # Web3 / Blockchain
   NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
   NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourDeployedSmartContractAddress
   PRIVATE_KEY=your_wallet_private_key
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```

## Workflow & System Roles
* **Admins**: Approve registrations and oversee active ledger analytics.
* **Investigators**: Initialize new case ledgers, upload digital evidence assets, and act as primary owners.
* **Custodians / Analysts**: Receive transferred evidence, investigate or store appropriately, and manipulate case status.
* **Auditors**: Read-only access to query any ledger across the system to cryptographically verify chain of custody integrity without modification power.
