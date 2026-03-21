import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICase extends Document {
    caseId: string;
    title: string;
    description: string;
    suspects: string[];
    inCharges: string[];
    witnesses: string[];
    status: "Open" | "Closed" | "Pending";
    evidence: {
        fileName: string;
        fileSize: number;
        hashAlgorithm: string;
        hash: string;
        fileUrl?: string;
        uploadedAt: Date;
        blockchainTxHash?: string;
        blockNumber?: number;
    }[];
    createdBy: mongoose.Types.ObjectId;
    assignedInvestigators: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const CaseSchema = new Schema<ICase>(
    {
        caseId: { type: String, required: true, unique: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        suspects: [{ type: String }],
        inCharges: [{ type: String }],
        witnesses: [{ type: String }],
        status: {
            type: String,
            enum: ["Open", "Closed", "Pending"],
            default: "Open",
        },
        evidence: [
            {
                fileName: String,
                fileSize: Number,
                hashAlgorithm: String,
                hash: String,
                fileUrl: String,
                uploadedAt: { type: Date, default: Date.now },
                blockchainTxHash: String,
                blockNumber: Number
            }
        ],
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        assignedInvestigators: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            }
        ],
    },
    { timestamps: true }
);

// Clear the cached model to prevent missing schema fields during Next.js hot-reloading
if (mongoose.models.Case) {
    delete mongoose.models.Case;
}

const Case: Model<ICase> = mongoose.model<ICase>("Case", CaseSchema);

export default Case;
