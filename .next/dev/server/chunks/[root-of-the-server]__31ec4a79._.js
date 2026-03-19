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
"[project]/Documents/GitHub/evidence-hash-demo/src/app/api/blockchain/roles/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$evidence$2d$hash$2d$demo$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/evidence-hash-demo/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$evidence$2d$hash$2d$demo$2f$src$2f$lib$2f$web3$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/evidence-hash-demo/src/lib/web3.ts [app-route] (ecmascript)");
;
;
async function POST(req) {
    try {
        const { role, address, enabled } = await req.json();
        if (!role || !address) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$evidence$2d$hash$2d$demo$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "role and address are required"
            }, {
                status: 400
            });
        }
        if (![
            'investigator',
            'custodian',
            'auditor'
        ].includes(role)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$evidence$2d$hash$2d$demo$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "role must be investigator, custodian, or auditor"
            }, {
                status: 400
            });
        }
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$evidence$2d$hash$2d$demo$2f$src$2f$lib$2f$web3$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["setRoleOnChain"])(role, address, enabled !== false);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$evidence$2d$hash$2d$demo$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(result, {
            status: 200
        });
    } catch (error) {
        console.error("Error in /api/blockchain/roles:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$evidence$2d$hash$2d$demo$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error.message || "Failed to set role"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__31ec4a79._.js.map