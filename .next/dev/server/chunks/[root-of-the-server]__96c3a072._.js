module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/Documents/GitHub/evidence-hash-demo/src/lib/mongodb.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Documents$2f$GitHub$2f$evidence$2d$hash$2d$demo$2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/Documents/GitHub/evidence-hash-demo/node_modules/mongoose)");
;
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}
/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */ let cached = /*TURBOPACK member replacement*/ __turbopack_context__.g.mongoose;
if (!cached) {
    cached = /*TURBOPACK member replacement*/ __turbopack_context__.g.mongoose = {
        conn: null,
        promise: null
    };
}
async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }
    if (!cached.promise) {
        const opts = {
            bufferCommands: false
        };
        cached.promise = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Documents$2f$GitHub$2f$evidence$2d$hash$2d$demo$2f$node_modules$2f$mongoose$29$__["default"].connect(MONGODB_URI, opts).then((mongoose)=>{
            return mongoose;
        });
    }
    cached.conn = await cached.promise;
    return cached.conn;
}
const __TURBOPACK__default__export__ = dbConnect;
}),
"[project]/Documents/GitHub/evidence-hash-demo/src/models/Case.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Documents$2f$GitHub$2f$evidence$2d$hash$2d$demo$2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/Documents/GitHub/evidence-hash-demo/node_modules/mongoose)");
;
const CaseSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Documents$2f$GitHub$2f$evidence$2d$hash$2d$demo$2f$node_modules$2f$mongoose$29$__["Schema"]({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    suspects: [
        {
            type: String
        }
    ],
    inCharges: [
        {
            type: String
        }
    ],
    witnesses: [
        {
            type: String
        }
    ],
    status: {
        type: String,
        enum: [
            "Open",
            "Closed",
            "Pending"
        ],
        default: "Open"
    },
    evidence: [
        {
            fileName: String,
            fileSize: Number,
            hashAlgorithm: String,
            hash: String,
            fileUrl: String,
            uploadedAt: {
                type: Date,
                default: Date.now
            },
            blockchainTxHash: String,
            blockNumber: Number
        }
    ],
    createdBy: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Documents$2f$GitHub$2f$evidence$2d$hash$2d$demo$2f$node_modules$2f$mongoose$29$__["Schema"].Types.ObjectId,
        ref: "User",
        required: true
    },
    assignedInvestigators: [
        {
            type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Documents$2f$GitHub$2f$evidence$2d$hash$2d$demo$2f$node_modules$2f$mongoose$29$__["Schema"].Types.ObjectId,
            ref: "User"
        }
    ]
}, {
    timestamps: true
});
const Case = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Documents$2f$GitHub$2f$evidence$2d$hash$2d$demo$2f$node_modules$2f$mongoose$29$__["default"].models.Case || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Documents$2f$GitHub$2f$evidence$2d$hash$2d$demo$2f$node_modules$2f$mongoose$29$__["default"].model("Case", CaseSchema);
const __TURBOPACK__default__export__ = Case;
}),
"[project]/Documents/GitHub/evidence-hash-demo/src/lib/verifyAuth.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "verifyAuth",
    ()=>verifyAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$evidence$2d$hash$2d$demo$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$verify$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/evidence-hash-demo/node_modules/jose/dist/webapi/jwt/verify.js [app-route] (ecmascript)");
;
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_do_not_use_in_prod";
async function verifyAuth(req) {
    const token = req.cookies.get("evidence_auth_token")?.value;
    if (!token) {
        return null;
    }
    try {
        const { payload } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$evidence$2d$hash$2d$demo$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$verify$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jwtVerify"])(token, new TextEncoder().encode(JWT_SECRET));
        return {
            id: payload.userId,
            email: payload.email,
            role: payload.role,
            name: payload.name
        };
    } catch (error) {
        console.error("JWT Verification failed:", error);
        return null;
    }
}
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/net [external] (net, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("net", () => require("net"));

module.exports = mod;
}),
"[externals]/tls [external] (tls, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tls", () => require("tls"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[project]/Documents/GitHub/evidence-hash-demo/src/lib/contract-abi.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// EvidenceLocker Smart Contract ABI
__turbopack_context__.s([
    "EVIDENCE_LOCKER_ABI",
    ()=>EVIDENCE_LOCKER_ABI
]);
const EVIDENCE_LOCKER_ABI = [
    {
        inputs: [],
        name: "admin",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "string",
                name: "evidenceId",
                type: "string"
            },
            {
                indexed: true,
                internalType: "string",
                name: "caseId",
                type: "string"
            },
            {
                indexed: true,
                internalType: "address",
                name: "by",
                type: "address"
            }
        ],
        name: "EvidenceRegistered",
        type: "event"
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "string",
                name: "evidenceId",
                type: "string"
            },
            {
                indexed: true,
                internalType: "address",
                name: "from",
                type: "address"
            },
            {
                indexed: true,
                internalType: "address",
                name: "to",
                type: "address"
            },
            {
                indexed: false,
                internalType: "string",
                name: "action",
                type: "string"
            }
        ],
        name: "CustodyTransferred",
        type: "event"
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "_evidenceId",
                type: "string"
            },
            {
                internalType: "string",
                name: "_caseId",
                type: "string"
            },
            {
                internalType: "string",
                name: "_fileHash",
                type: "string"
            }
        ],
        name: "registerEvidence",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_user",
                type: "address"
            },
            {
                internalType: "bool",
                name: "_enabled",
                type: "bool"
            }
        ],
        name: "setInvestigator",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_user",
                type: "address"
            },
            {
                internalType: "bool",
                name: "_enabled",
                type: "bool"
            }
        ],
        name: "setCustodian",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_user",
                type: "address"
            },
            {
                internalType: "bool",
                name: "_enabled",
                type: "bool"
            }
        ],
        name: "setAuditor",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "_evidenceId",
                type: "string"
            },
            {
                internalType: "address",
                name: "_to",
                type: "address"
            },
            {
                internalType: "string",
                name: "_action",
                type: "string"
            }
        ],
        name: "transferCustody",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "_evidenceId",
                type: "string"
            }
        ],
        name: "getEvidence",
        outputs: [
            {
                internalType: "string",
                name: "evidenceId",
                type: "string"
            },
            {
                internalType: "string",
                name: "caseId",
                type: "string"
            },
            {
                internalType: "string",
                name: "fileHash",
                type: "string"
            },
            {
                internalType: "uint256",
                name: "timestamp",
                type: "uint256"
            },
            {
                internalType: "address",
                name: "currentHolder",
                type: "address"
            },
            {
                internalType: "string",
                name: "status",
                type: "string"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "_evidenceId",
                type: "string"
            }
        ],
        name: "getChainOfCustody",
        outputs: [
            {
                components: [
                    {
                        internalType: "address",
                        name: "from",
                        type: "address"
                    },
                    {
                        internalType: "address",
                        name: "to",
                        type: "address"
                    },
                    {
                        internalType: "uint256",
                        name: "timestamp",
                        type: "uint256"
                    },
                    {
                        internalType: "string",
                        name: "action",
                        type: "string"
                    }
                ],
                internalType: "struct EvidenceLocker.CustodyLog[]",
                name: "",
                type: "tuple[]"
            }
        ],
        stateMutability: "view",
        type: "function"
    }
];
}),
"[project]/Documents/GitHub/evidence-hash-demo/src/lib/web3.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getChainOfCustodyFromChain",
    ()=>getChainOfCustodyFromChain,
    "getContractInstance",
    ()=>getContractInstance,
    "getEvidenceFromChain",
    ()=>getEvidenceFromChain,
    "registerEvidenceOnChain",
    ()=>registerEvidenceOnChain,
    "setRoleOnChain",
    ()=>setRoleOnChain,
    "transferCustodyOnChain",
    ()=>transferCustodyOnChain,
    "verifyEvidenceHash",
    ()=>verifyEvidenceHash
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$evidence$2d$hash$2d$demo$2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/evidence-hash-demo/node_modules/ethers/lib.esm/ethers.js [app-route] (ecmascript) <export * as ethers>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$evidence$2d$hash$2d$demo$2f$src$2f$lib$2f$contract$2d$abi$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/evidence-hash-demo/src/lib/contract-abi.ts [app-route] (ecmascript)");
;
;
async function getContractInstance() {
    const contractAddress = ("TURBOPACK compile-time value", "0xbE9558F43290B045E61DdA92464D4B9866f91295");
    const rpcUrl = ("TURBOPACK compile-time value", "https://eth-sepolia.g.alchemy.com/v2/8nMV8DjWkQQbxSX4vEwWG");
    const privateKey = process.env.PRIVATE_KEY;
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    if (!privateKey) {
        throw new Error("PRIVATE_KEY environment variable is not set");
    }
    // Create provider from RPC URL
    const provider = new __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$evidence$2d$hash$2d$demo$2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__["ethers"].JsonRpcProvider(rpcUrl);
    // Create signer from private key
    const signer = new __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$evidence$2d$hash$2d$demo$2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__["ethers"].Wallet(privateKey, provider);
    // Create contract instance with signer to enable write operations
    const contract = new __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$evidence$2d$hash$2d$demo$2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__["ethers"].Contract(contractAddress, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$evidence$2d$hash$2d$demo$2f$src$2f$lib$2f$contract$2d$abi$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["EVIDENCE_LOCKER_ABI"], signer);
    return {
        contract,
        provider,
        signer
    };
}
async function registerEvidenceOnChain(evidenceId, caseId, fileHash) {
    try {
        const { contract } = await getContractInstance();
        // Call registerEvidence function on smart contract
        const tx = await contract.registerEvidence(evidenceId, caseId, fileHash);
        // Wait for transaction confirmation
        const receipt = await tx.wait();
        console.log(`Evidence registered on blockchain. TX Hash: ${receipt.hash}`);
        return {
            success: true,
            transactionHash: receipt.hash,
            blockNumber: receipt.blockNumber
        };
    } catch (error) {
        console.error("Error registering evidence on blockchain:", error);
        throw new Error(`Blockchain registration failed: ${error.message}`);
    }
}
async function getEvidenceFromChain(evidenceId) {
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
            status
        };
    } catch (error) {
        console.error("Error retrieving evidence from blockchain:", error);
        throw new Error(`Failed to retrieve evidence: ${error.message}`);
    }
}
async function getChainOfCustodyFromChain(evidenceId) {
    try {
        const { contract } = await getContractInstance();
        // Call getChainOfCustody function on smart contract
        const custodyLogs = await contract.getChainOfCustody(evidenceId);
        // Parse and format the results
        return custodyLogs.map((log)=>({
                from: log.from,
                to: log.to,
                timestamp: BigInt(log.timestamp).toString(),
                action: log.action
            }));
    } catch (error) {
        console.error("Error retrieving custody chain from blockchain:", error);
        throw new Error(`Failed to retrieve custody chain: ${error.message}`);
    }
}
async function transferCustodyOnChain(evidenceId, toAddress, action) {
    try {
        const { contract } = await getContractInstance();
        // Validate Ethereum address
        if (!__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$evidence$2d$hash$2d$demo$2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__["ethers"].isAddress(toAddress)) {
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
            blockNumber: receipt.blockNumber
        };
    } catch (error) {
        console.error("Error transferring custody on blockchain:", error);
        throw new Error(`Custody transfer failed: ${error.message}`);
    }
}
async function setRoleOnChain(role, userAddress, enabled = true) {
    try {
        const { contract } = await getContractInstance();
        if (!__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$evidence$2d$hash$2d$demo$2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__["ethers"].isAddress(userAddress)) {
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
            blockNumber: receipt.blockNumber
        };
    } catch (error) {
        console.error(`Error setting ${role} role on blockchain:`, error);
        throw new Error(`Role assignment failed: ${error.message}`);
    }
}
async function verifyEvidenceHash(evidenceId, fileHash) {
    try {
        const evidence = await getEvidenceFromChain(evidenceId);
        return evidence.fileHash === fileHash;
    } catch (error) {
        console.error("Error verifying evidence hash:", error);
        return false;
    }
}
}),
"[project]/Documents/GitHub/evidence-hash-demo/src/app/api/cases/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$evidence$2d$hash$2d$demo$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/evidence-hash-demo/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$evidence$2d$hash$2d$demo$2f$src$2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/evidence-hash-demo/src/lib/mongodb.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$evidence$2d$hash$2d$demo$2f$src$2f$models$2f$Case$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/evidence-hash-demo/src/models/Case.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$evidence$2d$hash$2d$demo$2f$src$2f$lib$2f$verifyAuth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/evidence-hash-demo/src/lib/verifyAuth.ts [app-route] (ecmascript)"); // We need to create this helper
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$evidence$2d$hash$2d$demo$2f$src$2f$lib$2f$web3$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/evidence-hash-demo/src/lib/web3.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$evidence$2d$hash$2d$demo$2f$node_modules$2f$uuid$2f$dist$2d$node$2f$v4$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/evidence-hash-demo/node_modules/uuid/dist-node/v4.js [app-route] (ecmascript) <export default as v4>");
;
;
;
;
;
;
async function GET(req) {
    try {
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$evidence$2d$hash$2d$demo$2f$src$2f$lib$2f$verifyAuth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifyAuth"])(req);
        if (!user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$evidence$2d$hash$2d$demo$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Unauthorized"
            }, {
                status: 401
            });
        }
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$evidence$2d$hash$2d$demo$2f$src$2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        // Admin, Auditor, Custodian, and Analyst roles have global read access to ledgers.
        // Investigators see cases they instantiated OR cases they have been explicitly assigned to collaborate on.
        const globalRoles = [
            "Admin",
            "Auditor",
            "Custodian",
            "Analyst"
        ];
        const query = globalRoles.includes(user.role) ? {} : {
            $or: [
                {
                    createdBy: user.id
                },
                {
                    assignedInvestigators: user.id
                }
            ]
        };
        const cases = await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$evidence$2d$hash$2d$demo$2f$src$2f$models$2f$Case$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find(query).populate('createdBy', 'name email').sort({
            createdAt: -1
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$evidence$2d$hash$2d$demo$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(cases, {
            status: 200
        });
    } catch (error) {
        console.error("Error fetching cases:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$evidence$2d$hash$2d$demo$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Internal Server Error"
        }, {
            status: 500
        });
    }
}
async function POST(req) {
    try {
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$evidence$2d$hash$2d$demo$2f$src$2f$lib$2f$verifyAuth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifyAuth"])(req);
        if (!user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$evidence$2d$hash$2d$demo$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Unauthorized"
            }, {
                status: 401
            });
        }
        // STRICT RBAC CORE POLICY: Only Investigators can initialize case ledgers
        if (user.role !== "Investigator") {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$evidence$2d$hash$2d$demo$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Forbidden: Only Investigators hold clearance to initialize ledgers."
            }, {
                status: 403
            });
        }
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$evidence$2d$hash$2d$demo$2f$src$2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        const body = await req.json();
        const { title, description, suspects, inCharges, witnesses, evidence, assignedInvestigators } = body;
        if (!title || !description) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$evidence$2d$hash$2d$demo$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Title and description are required"
            }, {
                status: 400
            });
        }
        // Ensure the creator is always in the assignedInvestigators array, and no duplicates exist
        const investigatorsArr = Array.isArray(assignedInvestigators) ? assignedInvestigators : [];
        const uniqueInvestigators = Array.from(new Set([
            ...investigatorsArr,
            user.id
        ]));
        const newCase = await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$evidence$2d$hash$2d$demo$2f$src$2f$models$2f$Case$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].create({
            title,
            description,
            suspects: suspects || [],
            inCharges: inCharges || [],
            witnesses: witnesses || [],
            evidence: evidence || [],
            createdBy: user.id,
            assignedInvestigators: uniqueInvestigators,
            status: "Open"
        });
        // Register evidence on blockchain if available
        if (evidence && evidence.length > 0) {
            // Process blockchain registration asynchronously
            const caseId = newCase._id.toString();
            for(let i = 0; i < evidence.length; i++){
                const e = evidence[i];
                try {
                    // Generate unique evidence ID
                    const evidenceId = `EV-${caseId.slice(0, 8)}-${i}-${(0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$evidence$2d$hash$2d$demo$2f$node_modules$2f$uuid$2f$dist$2d$node$2f$v4$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])().slice(0, 8)}`;
                    // Register on blockchain
                    const blockchainResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$evidence$2d$hash$2d$demo$2f$src$2f$lib$2f$web3$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["registerEvidenceOnChain"])(evidenceId, caseId, e.hash);
                    // Update evidence with blockchain transaction details
                    newCase.evidence[i] = {
                        ...e,
                        blockchainTxHash: blockchainResult.transactionHash,
                        blockNumber: blockchainResult.blockNumber
                    };
                    console.log(`Evidence ${evidenceId} registered on blockchain`);
                } catch (blockchainError) {
                    // Log the error but don't fail the case creation
                    console.error(`Failed to register evidence on blockchain: ${blockchainError}`);
                    console.warn("Evidence saved to MongoDB but blockchain registration failed");
                }
            }
            // Save updated case with blockchain transaction hashes
            await newCase.save();
        }
        // Initialize Chain of Custody logs for any uploaded evidence
        if (evidence && evidence.length > 0) {
            const custodyLogs = evidence.map((e, i)=>({
                    caseId: newCase._id,
                    evidenceHash: e.hash,
                    action: "Uploaded",
                    performedBy: user.id,
                    locationStatus: "System Intake",
                    notes: "Initial evidence upload during ledger creation.",
                    blockchainTxHash: newCase.evidence?.[i]?.blockchainTxHash || null,
                    blockNumber: newCase.evidence?.[i]?.blockNumber || null
                }));
            // Dynamically import to avoid circular dependencies if any, though likely safe
            const ChainOfCustody = (await __turbopack_context__.A("[project]/Documents/GitHub/evidence-hash-demo/src/models/ChainOfCustody.ts [app-route] (ecmascript, async loader)")).default;
            await ChainOfCustody.insertMany(custodyLogs);
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$evidence$2d$hash$2d$demo$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(newCase, {
            status: 201
        });
    } catch (error) {
        console.error("Error creating case:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$evidence$2d$hash$2d$demo$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Internal Server Error"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__96c3a072._.js.map