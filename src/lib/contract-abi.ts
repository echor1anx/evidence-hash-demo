// EvidenceLocker Smart Contract ABI
export const EVIDENCE_LOCKER_ABI = [
  {
    inputs: [],
    name: "admin",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "string", name: "evidenceId", type: "string" },
      { indexed: true, internalType: "string", name: "caseId", type: "string" },
      { indexed: true, internalType: "address", name: "by", type: "address" },
    ],
    name: "EvidenceRegistered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "string", name: "evidenceId", type: "string" },
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      { indexed: false, internalType: "string", name: "action", type: "string" },
    ],
    name: "CustodyTransferred",
    type: "event",
  },
  {
    inputs: [
      { internalType: "string", name: "_evidenceId", type: "string" },
      { internalType: "string", name: "_caseId", type: "string" },
      { internalType: "string", name: "_fileHash", type: "string" },
    ],
    name: "registerEvidence",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_user", type: "address" },
      { internalType: "bool", name: "_enabled", type: "bool" },
    ],
    name: "setInvestigator",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_user", type: "address" },
      { internalType: "bool", name: "_enabled", type: "bool" },
    ],
    name: "setCustodian",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_user", type: "address" },
      { internalType: "bool", name: "_enabled", type: "bool" },
    ],
    name: "setAuditor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "_evidenceId", type: "string" },
      { internalType: "address", name: "_to", type: "address" },
      { internalType: "string", name: "_action", type: "string" },
    ],
    name: "transferCustody",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "_evidenceId", type: "string" }],
    name: "getEvidence",
    outputs: [
      { internalType: "string", name: "evidenceId", type: "string" },
      { internalType: "string", name: "caseId", type: "string" },
      { internalType: "string", name: "fileHash", type: "string" },
      { internalType: "uint256", name: "timestamp", type: "uint256" },
      { internalType: "address", name: "currentHolder", type: "address" },
      { internalType: "string", name: "status", type: "string" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "_evidenceId", type: "string" }],
    name: "getChainOfCustody",
    outputs: [
      {
        components: [
          { internalType: "address", name: "from", type: "address" },
          { internalType: "address", name: "to", type: "address" },
          { internalType: "uint256", name: "timestamp", type: "uint256" },
          { internalType: "string", name: "action", type: "string" },
        ],
        internalType: "struct EvidenceLocker.CustodyLog[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
