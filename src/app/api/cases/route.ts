import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Case from "@/models/Case";
import { verifyAuth } from "@/lib/verifyAuth"; // We need to create this helper
import { registerEvidenceOnChain } from "@/lib/web3";
import { v4 as uuidv4 } from "uuid";

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

        const count = await Case.countDocuments();
        const generatedCaseId = `CAS-${count + 1}`;

        const newCase = await Case.create({
            caseId: generatedCaseId,
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

        // Register evidence on blockchain if available
        if (evidence && evidence.length > 0) {
            // Process blockchain registration asynchronously
            const caseId = newCase._id.toString();
            
            for (let i = 0; i < evidence.length; i++) {
                const e = evidence[i];
                try {
                    // Generate unique evidence ID using Case ID
                    const evidenceId = i === 0 ? generatedCaseId : `${generatedCaseId}-${i}`;
                    
                    // Register on blockchain
                    const blockchainResult = await registerEvidenceOnChain(
                        evidenceId,
                        caseId,
                        e.hash
                    );
                    
                    // Update evidence with blockchain transaction details
                    newCase.evidence[i] = {
                        ...e,
                        blockchainTxHash: blockchainResult.transactionHash,
                        blockNumber: blockchainResult.blockNumber,
                    };
                    
                    console.log(`Evidence ${evidenceId} registered on blockchain`);
                } catch (blockchainError) {
                    // Log the error but don't fail the case creation
                    console.error(`Failed to register evidence on blockchain: ${blockchainError}`);
                    console.warn("Evidence saved to MongoDB but blockchain registration failed");
                }
            }
            
            // Save updated case with blockchain transaction hashes
            await newCase.save();
        }

        // Initialize Chain of Custody logs for any uploaded evidence
        if (evidence && evidence.length > 0) {
            const custodyLogs = evidence.map((e: any, i: number) => ({
                caseId: newCase._id,
                evidenceHash: e.hash,
                action: "Uploaded",
                performedBy: user.id,
                locationStatus: "System Intake",
                notes: "Initial evidence upload during ledger creation.",
                blockchainTxHash: newCase.evidence?.[i]?.blockchainTxHash || null,
                blockNumber: newCase.evidence?.[i]?.blockNumber || null,
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
