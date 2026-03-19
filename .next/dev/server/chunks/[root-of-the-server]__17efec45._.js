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
"[project]/Documents/GitHub/evidence-hash-demo/src/models/ChainOfCustody.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Documents$2f$GitHub$2f$evidence$2d$hash$2d$demo$2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/Documents/GitHub/evidence-hash-demo/node_modules/mongoose)");
;
const ChainOfCustodySchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Documents$2f$GitHub$2f$evidence$2d$hash$2d$demo$2f$node_modules$2f$mongoose$29$__["Schema"]({
    caseId: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Documents$2f$GitHub$2f$evidence$2d$hash$2d$demo$2f$node_modules$2f$mongoose$29$__["Schema"].Types.ObjectId,
        ref: "Case",
        required: true
    },
    evidenceHash: {
        type: String,
        required: true,
        index: true
    },
    action: {
        type: String,
        enum: [
            "Uploaded",
            "Checked Out",
            "Checked In",
            "Transferred",
            "Hash Verified",
            "Archived"
        ],
        required: true
    },
    performedBy: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Documents$2f$GitHub$2f$evidence$2d$hash$2d$demo$2f$node_modules$2f$mongoose$29$__["Schema"].Types.ObjectId,
        ref: "User",
        required: true
    },
    transferredTo: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Documents$2f$GitHub$2f$evidence$2d$hash$2d$demo$2f$node_modules$2f$mongoose$29$__["Schema"].Types.ObjectId,
        ref: "User"
    },
    locationStatus: {
        type: String,
        required: true
    },
    notes: {
        type: String,
        required: true
    },
    blockchainTxHash: {
        type: String,
        index: true
    },
    blockNumber: {
        type: Number
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});
// Prevent accidental modification of logs - Append Only nature
ChainOfCustodySchema.pre("findOneAndUpdate", function(next) {
    next(new Error("Chain of Custody records are immutable and cannot be updated."));
});
ChainOfCustodySchema.pre("updateOne", function(next) {
    next(new Error("Chain of Custody records are immutable and cannot be updated."));
});
ChainOfCustodySchema.pre("deleteOne", function(next) {
    next(new Error("Chain of Custody records are immutable and cannot be deleted."));
});
ChainOfCustodySchema.pre("deleteMany", function(next) {
    next(new Error("Chain of Custody records are immutable and cannot be deleted."));
});
const ChainOfCustody = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Documents$2f$GitHub$2f$evidence$2d$hash$2d$demo$2f$node_modules$2f$mongoose$29$__["default"].models.ChainOfCustody || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Documents$2f$GitHub$2f$evidence$2d$hash$2d$demo$2f$node_modules$2f$mongoose$29$__["default"].model("ChainOfCustody", ChainOfCustodySchema);
const __TURBOPACK__default__export__ = ChainOfCustody;
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
"[project]/Documents/GitHub/evidence-hash-demo/src/app/api/custody/[caseId]/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$evidence$2d$hash$2d$demo$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/evidence-hash-demo/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$evidence$2d$hash$2d$demo$2f$src$2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/evidence-hash-demo/src/lib/mongodb.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$evidence$2d$hash$2d$demo$2f$src$2f$models$2f$ChainOfCustody$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/evidence-hash-demo/src/models/ChainOfCustody.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$evidence$2d$hash$2d$demo$2f$src$2f$models$2f$Case$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/evidence-hash-demo/src/models/Case.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$evidence$2d$hash$2d$demo$2f$src$2f$lib$2f$verifyAuth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/evidence-hash-demo/src/lib/verifyAuth.ts [app-route] (ecmascript)");
;
;
;
;
;
async function GET(req, { params }) {
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
        const caseId = (await params).caseId;
        const caseItem = await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$evidence$2d$hash$2d$demo$2f$src$2f$models$2f$Case$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findById(caseId);
        if (!caseItem) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$evidence$2d$hash$2d$demo$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Case not found"
            }, {
                status: 404
            });
        }
        // Role-based access control matches the /api/cases/[id] endpoint
        const globalRoles = [
            "Admin",
            "Auditor",
            "Custodian",
            "Analyst"
        ];
        if (!globalRoles.includes(user.role) && caseItem.createdBy.toString() !== user.id) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$evidence$2d$hash$2d$demo$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Forbidden: Unauthorized access to ledger block"
            }, {
                status: 403
            });
        }
        // Fetch logs sorted by oldest first to build a timeline
        const logs = await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$evidence$2d$hash$2d$demo$2f$src$2f$models$2f$ChainOfCustody$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find({
            caseId
        }).sort({
            timestamp: 1
        }).populate("performedBy", "name email role").populate("transferredTo", "name email role");
        return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$evidence$2d$hash$2d$demo$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(logs, {
            status: 200
        });
    } catch (error) {
        console.error("Error fetching chain of custody:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$evidence$2d$hash$2d$demo$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Internal Server Error"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__17efec45._.js.map