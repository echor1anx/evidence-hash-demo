import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import ChainOfCustody from "@/models/ChainOfCustody";
import Case from "@/models/Case";
import { verifyAuth } from "@/lib/verifyAuth";

export async function POST(req: NextRequest) {
    try {
        const user = await verifyAuth(req);
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const globalRoles = ["Admin", "Auditor", "Custodian", "Analyst"];
        if (!globalRoles.includes(user.role) && user.role !== "Investigator") {
             return NextResponse.json({ error: "Forbidden: You do not have permissions to modify evidence custody." }, { status: 403 });
        }

        await dbConnect();

        const body = await req.json();
        const { caseId, evidenceHash, action, locationStatus, notes, transferredTo } = body;

        if (!caseId || !evidenceHash || !action || !locationStatus || !notes) {
            return NextResponse.json(
                { error: "caseId, evidenceHash, action, locationStatus, and notes are required fields." },
                { status: 400 }
            );
        }

        // Verify the case exists and the evidence belongs to the case
        const caseItem = await Case.findById(caseId);
        if (!caseItem) {
             return NextResponse.json({ error: "Case not found." }, { status: 404 });
        }

        const evidenceExists = caseItem.evidence.some(e => e.hash === evidenceHash);
        if (!evidenceExists) {
              return NextResponse.json({ error: "Evidence hash not found in this case ledger." }, { status: 404 });
        }

        const newLog = await ChainOfCustody.create({
            caseId,
            evidenceHash,
            action,
            performedBy: user.id,
            locationStatus,
            notes,
            transferredTo: transferredTo || undefined
        });

        // Populate user details before returning
        await newLog.populate("performedBy", "name email role");
        if (newLog.transferredTo) {
            await newLog.populate("transferredTo", "name email role");
        }

        return NextResponse.json(newLog, { status: 201 });
    } catch (error: any) {
        console.error("Error logging chain of custody:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
