import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Case from "@/models/Case";
import { verifyAuth } from "@/lib/verifyAuth";

/**
 * POST /api/evidence/[id]/sync
 * Called by syncFromChain() in sync.ts to rebuild the MongoDB record from blockchain data.
 */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const user = await verifyAuth(req);
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Only Investigators, Admins, or Auditors can trigger a sync
        if (!["Investigator", "Admin", "Auditor"].includes(user.role as string)) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        await dbConnect();
        const { id: evidenceId } = await params;
        const body = await req.json();
        const { caseId, hash, ipfsCID, txHash, blockNumber, onChainTimestamp } = body;

        if (!caseId || !hash) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Update the evidence record with the chain data
        const result = await Case.updateOne(
            { "evidence.evidenceId": evidenceId },
            {
                $set: {
                    "evidence.$.hash": hash,
                    "evidence.$.ipfsCID": ipfsCID,
                    "evidence.$.txHash": txHash,
                    "evidence.$.blockNumber": blockNumber,
                    "evidence.$.onChainTimestamp": onChainTimestamp,
                    "evidence.$.contractEvidenceId": evidenceId,
                }
            }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: "Evidence not found in MongoDB" }, { status: 404 });
        }

        return NextResponse.json({ success: true, synced: true });
    } catch (error) {
        console.error("Sync error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
