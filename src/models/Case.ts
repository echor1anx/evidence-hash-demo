import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICase extends Document {
    title: string;
    description: string;
    suspects: string[];
    inCharges: string[];
    witnesses: string[];
    status: "Open" | "Closed" | "Pending";
    evidence: {
        evidenceId: string;          // Required to link to Smart Contract
        fileName: string;
        fileSize: number;
        hashAlgorithm: string;
        hash: string;
        fileUrl?: string;
        // Blockchain / IPFS fields
        txHash?: string;             // Ethereum transaction hash from the blockchain
        ipfsCID?: string;            // IPFS Content Identifier for file retrieval
        contractEvidenceId?: string; // ID used on-chain (matches evidenceId)
        blockNumber?: number;        // Block number when evidence was registered
        onChainTimestamp?: number;   // Timestamp from blockchain event (Unix seconds)
        uploadedAt: Date;
<<<<<<< Updated upstream
        blockchainTxHash?: string;
        blockNumber?: number;
=======
        accessCount: number;
>>>>>>> Stashed changes
    }[];
    createdBy: mongoose.Types.ObjectId;
    assignedInvestigators: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const CaseSchema = new Schema<ICase>(
    {
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
                evidenceId: { type: String, required: true },
                fileName: String,
                fileSize: Number,
                hashAlgorithm: String,
                hash: String,
                fileUrl: String,
<<<<<<< Updated upstream
                uploadedAt: { type: Date, default: Date.now },
                blockchainTxHash: String,
                blockNumber: Number
=======
                // Blockchain / IPFS fields
                txHash: String,
                ipfsCID: String,
                contractEvidenceId: String,
                blockNumber: Number,
                onChainTimestamp: Number,
                uploadedAt: { type: Date, default: Date.now },
                accessCount: { type: Number, default: 0 }
>>>>>>> Stashed changes
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

const Case: Model<ICase> =
    mongoose.models.Case || mongoose.model<ICase>("Case", CaseSchema);

export default Case;
