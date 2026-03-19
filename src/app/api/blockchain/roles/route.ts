import { NextRequest, NextResponse } from "next/server";
import { setRoleOnChain } from "@/lib/web3";

export async function POST(req: NextRequest) {
  try {
    const { role, address, enabled } = await req.json();

    if (!role || !address) {
      return NextResponse.json({ error: "role and address are required" }, { status: 400 });
    }

    if (!['investigator', 'custodian', 'auditor'].includes(role)) {
      return NextResponse.json({ error: "role must be investigator, custodian, or auditor" }, { status: 400 });
    }

    const result = await setRoleOnChain(role as any, address, enabled !== false);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("Error in /api/blockchain/roles:", error);
    return NextResponse.json({ error: error.message || "Failed to set role" }, { status: 500 });
  }
}
