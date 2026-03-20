// import mongoose, { Schema, Document, Model } from "mongoose";

// export interface IChainOfCustody extends Document {
//     caseId: mongoose.Types.ObjectId;
//     evidenceHash: string; // The file hash representing the evidence
//     action: "Uploaded" | "Checked Out" | "Checked In" | "Transferred" | "Hash Verified" | "Archived";
//     performedBy: mongoose.Types.ObjectId; // User who performed the action
//     transferredTo?: mongoose.Types.ObjectId; // Optional: User who received the evidence
//     locationStatus: string; // e.g., "Secure Storage", "Analyst Desk"
//     notes: string;
//     timestamp: Date;
// }

// const ChainOfCustodySchema = new Schema<IChainOfCustody>(
//     {
//         caseId: {
//             type: Schema.Types.ObjectId,
//             ref: "Case",
//             required: true,
//         },
//         evidenceHash: {
//             type: String,
//             required: true,
//             index: true
//         },
//         action: {
//             type: String,
//             enum: ["Uploaded", "Checked Out", "Checked In", "Transferred", "Hash Verified", "Archived"],
//             required: true,
//         },
//         performedBy: {
//             type: Schema.Types.ObjectId,
//             ref: "User",
//             required: true,
//         },
//         transferredTo: {
//             type: Schema.Types.ObjectId,
//             ref: "User",
//         },
//         locationStatus: {
//             type: String,
//             required: true,
//         },
//         notes: {
//             type: String,
//             required: true,
//         },
//         blockchainTxHash: {
//             type: String,
//             index: true,
//         },
//         blockNumber: {
//             type: Number,
//         },
//         timestamp: {
//             type: Date,
//             default: Date.now,
//         },
//     },
//     { timestamps: true }
// );

// // Prevent accidental modification of logs - Append Only nature
// ChainOfCustodySchema.pre("findOneAndUpdate", function (next) {
//     next(new Error("Chain of Custody records are immutable and cannot be updated."));
// });

// ChainOfCustodySchema.pre("updateOne", function (next) {
//     next(new Error("Chain of Custody records are immutable and cannot be updated."));
// });

// ChainOfCustodySchema.pre("deleteOne", function (next) {
//     next(new Error("Chain of Custody records are immutable and cannot be deleted."));
// });

// ChainOfCustodySchema.pre("deleteMany", function (next) {
//     next(new Error("Chain of Custody records are immutable and cannot be deleted."));
// });

// const ChainOfCustody: Model<IChainOfCustody> =
//     mongoose.models.ChainOfCustody || mongoose.model<IChainOfCustody>("ChainOfCustody", ChainOfCustodySchema);

// export default ChainOfCustody;


// new code starts from here 💀😂🔴

import mongoose, { Schema, Document, Model } from "mongoose";

export interface IChainOfCustody extends Document {
    caseId: mongoose.Types.ObjectId;
<<<<<<< Updated upstream
    evidenceHash: string;
    action: "Uploaded" | "Checked Out" | "Checked In" | "Transferred" | "Hash Verified" | "Archived";
    performedBy: mongoose.Types.ObjectId;
    transferredTo?: mongoose.Types.ObjectId;
    locationStatus: string;
=======
    evidenceHash: string; // The file hash representing the evidence
    action: "Uploaded" | "Checked Out" | "Checked In" | "Transferred" | "Hash Verified" | "Archived" | "Modified" | "Accessed";
    performedBy: mongoose.Types.ObjectId; // User who performed the action
    transferredTo?: mongoose.Types.ObjectId; // Optional: User who received the evidence
    locationStatus: string; // e.g., "Secure Storage", "Analyst Desk"
>>>>>>> Stashed changes
    notes: string;

    blockchainTxHash?: string; // ✅ added
    blockNumber?: number;      // ✅ added

    timestamp: Date;
}

const ChainOfCustodySchema = new Schema<IChainOfCustody>(
    {
        caseId: {
            type: Schema.Types.ObjectId,
            ref: "Case",
            required: true,
        },
        evidenceHash: {
            type: String,
            required: true,
            index: true,
        },
        action: {
            type: String,
            enum: ["Uploaded", "Checked Out", "Checked In", "Transferred", "Hash Verified", "Archived", "Modified", "Accessed"],
            required: true,
        },
        performedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        transferredTo: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        locationStatus: {
            type: String,
            required: true,
        },
        notes: {
            type: String,
            required: true,
        },
        blockchainTxHash: {
            type: String,
            index: true,
        },
        blockNumber: {
            type: Number,
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

// 🚫 Prevent modification (append-only log)
ChainOfCustodySchema.pre("findOneAndUpdate", function (next) {
    next(new Error("Chain of Custody records are immutable and cannot be updated."));
});

ChainOfCustodySchema.pre("updateOne", function (next) {
    next(new Error("Chain of Custody records are immutable and cannot be updated."));
});

ChainOfCustodySchema.pre("deleteOne", function (next) {
    next(new Error("Chain of Custody records are immutable and cannot be deleted."));
});

ChainOfCustodySchema.pre("deleteMany", function (next) {
    next(new Error("Chain of Custody records are immutable and cannot be deleted."));
});

const ChainOfCustody: Model<IChainOfCustody> =
    mongoose.models.ChainOfCustody ||
    mongoose.model<IChainOfCustody>("ChainOfCustody", ChainOfCustodySchema);

export default ChainOfCustody;
