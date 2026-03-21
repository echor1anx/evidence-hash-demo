import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Case from "@/models/Case";
import { verifyAuth } from "@/lib/verifyAuth";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await verifyAuth(req);
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const caseId = (await params).id;
        const caseItem = await Case.findById(caseId);

        if (!caseItem) {
            return NextResponse.json({ error: "Case not found" }, { status: 404 });
        }

        // Role-based access control (Global Roles + Specific Investigator / Shared Investigator)
        const globalRoles = ["Admin", "Auditor", "Custodian", "Analyst"];
        
        const isCreator = caseItem.createdBy?.toString() === user.id;
        const isAssigned = caseItem.assignedInvestigators?.some((id: any) => id.toString() === user.id);

        if (!globalRoles.includes(user.role) && !isCreator && !isAssigned) {
            return NextResponse.json({ error: "Forbidden: Unauthorized access to ledger block" }, { status: 403 });
        }

        return NextResponse.json(caseItem, { status: 200 });
    } catch (error) {
        console.error("Error fetching case:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
