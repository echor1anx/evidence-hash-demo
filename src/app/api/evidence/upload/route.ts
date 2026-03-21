import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Case from "@/models/Case";
import ChainOfCustody from "@/models/ChainOfCustody";
import { verifyAuth } from "@/lib/verifyAuth";

export async function POST(req: NextRequest) {
    try {
        const user = await verifyAuth(req);
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Only Investigators/Admins can upload directly to a case
        if (user.role !== "Investigator" && user.role !== "Admin") {
            return NextResponse.json(
                { error: "Forbidden: Not authorized to upload evidence." },
                { status: 403 }
            );
        }

        await dbConnect();
        const body = await req.json();

        const {
            caseId,
            evidenceId,
            fileName,
            fileSize,
            hashAlgorithm,
            hash,
            // Blockchain / IPFS fields (provided by frontend after MetaMask tx)
            ipfsCID,
            txHash,
            blockNumber,
            contractEvidenceId,
            onChainTimestamp,
        } = body;

        if (!caseId || !evidenceId || !hash) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // 1. Update the Case with the new evidence
        const updatedCase = await Case.findByIdAndUpdate(
            caseId,
            {
                $push: {
                    evidence: {
                        evidenceId,
                        fileName,
                        fileSize,
                        hashAlgorithm: hashAlgorithm || "SHA-256",
                        hash,
                        // Blockchain / IPFS fields
                        ipfsCID: ipfsCID || null,
                        txHash: txHash || null,
                        blockNumber: blockNumber || null,
                        contractEvidenceId: contractEvidenceId || evidenceId,
                        onChainTimestamp: onChainTimestamp || null,
                        uploadedAt: new Date(),
                        accessCount: 0
                    }
                }
            },
            { new: true }
        );

        if (!updatedCase) {
            return NextResponse.json({ error: "Case not found" }, { status: 404 });
        }

        // 2. Add an initial Chain of Custody log
        await ChainOfCustody.create({
            caseId: updatedCase._id,
            evidenceHash: hash,
            action: "Uploaded",
            performedBy: user.id,
            locationStatus: "IPFS + Blockchain",
            notes: txHash
                ? `Evidence registered on Sepolia blockchain. TX: ${txHash}. IPFS CID: ${ipfsCID || "N/A"}`
                : "Evidence uploaded (no blockchain record)"
        });

        return NextResponse.json({ success: true, evidenceId }, { status: 201 });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
