import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Case from "@/models/Case";
import { verifyAuth } from "@/lib/verifyAuth"; // We need to create this helper

export async function GET(req: NextRequest) {
    try {
        const user = await verifyAuth(req);
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        // Admin, Auditor, Custodian, and Analyst roles have global read access to ledgers.
        // Investigators see cases they instantiated OR cases they have been explicitly assigned to collaborate on.
        const globalRoles = ["Admin", "Auditor", "Custodian", "Analyst"];
        const query = globalRoles.includes(user.role) ? {} : { 
            $or: [
                { createdBy: user.id },
                { assignedInvestigators: user.id }
            ]
        };

        const cases = await Case.find(query)
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });

        return NextResponse.json(cases, { status: 200 });
    } catch (error) {
        console.error("Error fetching cases:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const user = await verifyAuth(req);
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // STRICT RBAC CORE POLICY: Only Investigators can initialize case ledgers
        if (user.role !== "Investigator") {
            return NextResponse.json(
                { error: "Forbidden: Only Investigators hold clearance to initialize ledgers." },
                { status: 403 }
            );
        }

        await dbConnect();

        const body = await req.json();
        const { title, description, suspects, inCharges, witnesses, evidence, assignedInvestigators } = body;

        if (!title || !description) {
            return NextResponse.json(
                { error: "Title and description are required" },
                { status: 400 }
            );
        }

        // Ensure the creator is always in the assignedInvestigators array, and no duplicates exist
        const investigatorsArr = Array.isArray(assignedInvestigators) ? assignedInvestigators : [];
        const uniqueInvestigators = Array.from(new Set([...investigatorsArr, user.id]));

        const newCase = await Case.create({
            title,
            description,
            suspects: suspects || [],
            inCharges: inCharges || [],
            witnesses: witnesses || [],
            evidence: evidence || [],
            createdBy: user.id,
            assignedInvestigators: uniqueInvestigators,
            status: "Open",
        });

        // Initialize Chain of Custody logs for any uploaded evidence
        if (evidence && evidence.length > 0) {
            const custodyLogs = evidence.map((e: any) => ({
                caseId: newCase._id,
                evidenceHash: e.hash,
                action: "Uploaded",
                performedBy: user.id,
                locationStatus: "System Intake",
                notes: "Initial evidence upload during ledger creation.",
            }));

            // Dynamically import to avoid circular dependencies if any, though likely safe
            const ChainOfCustody = (await import("@/models/ChainOfCustody")).default;
            await ChainOfCustody.insertMany(custodyLogs);
        }

        return NextResponse.json(newCase, { status: 201 });
    } catch (error) {
        console.error("Error creating case:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
