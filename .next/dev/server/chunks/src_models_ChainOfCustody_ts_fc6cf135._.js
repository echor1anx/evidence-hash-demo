module.exports = [
"[project]/src/models/ChainOfCustody.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/mongoose)");
;
const ChainOfCustodySchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["Schema"]({
    caseId: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["Schema"].Types.ObjectId,
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
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["Schema"].Types.ObjectId,
        ref: "User",
        required: true
    },
    transferredTo: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["Schema"].Types.ObjectId,
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
const ChainOfCustody = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].models.ChainOfCustody || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].model("ChainOfCustody", ChainOfCustodySchema);
const __TURBOPACK__default__export__ = ChainOfCustody;
}),
];

//# sourceMappingURL=src_models_ChainOfCustody_ts_fc6cf135._.js.map