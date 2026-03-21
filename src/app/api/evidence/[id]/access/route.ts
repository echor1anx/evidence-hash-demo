import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Case from "@/models/Case";
import ChainOfCustody from "@/models/ChainOfCustody";
import { verifyAuth } from "@/lib/verifyAuth";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await verifyAuth(req);
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const { id: evidenceId } = await params;

        // Find case containing this evidence
        const caseRecord = await Case.findOne({
            "evidence.evidenceId": evidenceId,
        });

        if (!caseRecord) {
            return NextResponse.json(
                { error: "Evidence not found" },
                { status: 404 }
            );
        }

        // Find specific evidence object
        const evidenceObj = caseRecord.evidence.find(
            (e: any) => e.evidenceId === evidenceId
        );

        // ✅ Type safety check
        if (!evidenceObj) {
            return NextResponse.json(
                { error: "Evidence not found" },
                { status: 404 }
            );
        }

        // Increment access count
        await Case.updateOne(
            { "evidence.evidenceId": evidenceId },
            { $inc: { "evidence.$.accessCount": 1 } }
        );

        // Log access in Chain of Custody
        await ChainOfCustody.create({
            caseId: caseRecord._id,
            evidenceHash: evidenceObj.hash,
            action: "Accessed",
            performedBy: user.id,
            locationStatus: "System View",
            notes: `Evidence accessed by ${user.role} (${user.name})`,
        });

        return NextResponse.json({
            success: true,
            incremented: true,
        });

    } catch (error) {
        console.error("Access log error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}