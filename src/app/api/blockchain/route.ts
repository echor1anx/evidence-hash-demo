import { NextRequest, NextResponse } from "next/server";
import {
  getEvidenceFromChain,
  getChainOfCustodyFromChain,
} from "@/lib/web3";

export async function POST(req: NextRequest) {
  try {
    const { evidenceId } = await req.json();

    if (!evidenceId) {
      return NextResponse.json(
        { error: "Evidence ID is required" },
        { status: 400 }
      );
    }

    // Fetch evidence details from blockchain
    const evidence = await getEvidenceFromChain(evidenceId);

    // Fetch custody chain from blockchain
    const custody = await getChainOfCustodyFromChain(evidenceId);

    return NextResponse.json(
      {
        evidence,
        custody,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Blockchain verification error:", error);

    // Check if it's a blockchain connection error
    if (error.message.includes("not configured") || error.message.includes("not set")) {
      return NextResponse.json(
        {
          error: "Blockchain integration not configured. Please set up environment variables.",
          details: error.message,
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to verify evidence on blockchain",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
