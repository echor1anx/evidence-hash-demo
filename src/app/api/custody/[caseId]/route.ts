import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import ChainOfCustody from "@/models/ChainOfCustody";
import Case from "@/models/Case";
import { verifyAuth } from "@/lib/verifyAuth";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ caseId: string }> }
) {
    try {
        const user = await verifyAuth(req);
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const caseId = (await params).caseId;
        const caseItem = await Case.findById(caseId);

        if (!caseItem) {
            return NextResponse.json({ error: "Case not found" }, { status: 404 });
        }

        // Role-based access control matches the /api/cases/[id] endpoint
        const globalRoles = ["Admin", "Auditor", "Custodian", "Analyst"];
        if (!globalRoles.includes(user.role) && caseItem.createdBy.toString() !== user.id) {
            return NextResponse.json({ error: "Forbidden: Unauthorized access to ledger block" }, { status: 403 });
        }

        // Fetch logs sorted by oldest first to build a timeline
        const logs = await ChainOfCustody.find({ caseId })
            .sort({ timestamp: 1 })
            .populate("performedBy", "name email role")
            .populate("transferredTo", "name email role");

        return NextResponse.json(logs, { status: 200 });
    } catch (error) {
        console.error("Error fetching chain of custody:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
