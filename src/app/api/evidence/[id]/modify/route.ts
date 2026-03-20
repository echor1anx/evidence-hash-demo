import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Case from "@/models/Case";
import ChainOfCustody from "@/models/ChainOfCustody";
import { verifyAuth } from "@/lib/verifyAuth";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const user = await verifyAuth(req);
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (user.role !== "Investigator" && user.role !== "Admin") {
            return NextResponse.json({ error: "Forbidden: Not authorized to modify evidence." }, { status: 403 });
        }

        await dbConnect();
        const { id: evidenceId } = await params;
        const body = await req.json();
        const { newHash, newFileName, newFileSize, newIpfsCID, txHash, blockNumber, note } = body;

        if (!newHash) {
            return NextResponse.json({ error: "New hash is required" }, { status: 400 });
        }

        const caseRecord = await Case.findOne({ "evidence.evidenceId": evidenceId });
        if (!caseRecord) {
            return NextResponse.json({ error: "Evidence not found" }, { status: 404 });
        }

        await Case.updateOne(
            { "evidence.evidenceId": evidenceId },
            {
                $set: {
                    "evidence.$.hash": newHash,
                    "evidence.$.fileName": newFileName || "Modified File",
                    "evidence.$.fileSize": newFileSize || 0,
                    "evidence.$.ipfsCID": newIpfsCID || null,
                    "evidence.$.txHash": txHash || null,
                    "evidence.$.blockNumber": blockNumber || null,
                    "evidence.$.uploadedAt": new Date()
                }
            }
        );

        await ChainOfCustody.create({
            caseId: caseRecord._id,
            evidenceHash: newHash,
            action: "Modified",
            performedBy: user.id,
            locationStatus: "Modified on Blockchain",
            notes: txHash
                ? `${note || "Evidence modified."} TX: ${txHash}. New IPFS CID: ${newIpfsCID || "N/A"}`
                : note || "Evidence file was modified."
        });

        return NextResponse.json({ success: true, newHash });
    } catch (error) {
        console.error("Modify Evidence error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
