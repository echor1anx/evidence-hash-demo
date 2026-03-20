import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/ipfs/upload
 * 
 * Server-side proxy that uploads a file to Pinata/IPFS.
 * Keeps API keys on the server — the client only sends the file via FormData.
 * Returns { cid: string } on success.
 */
export async function POST(req: NextRequest) {
  try {
    const PINATA_API_KEY = process.env.PINATA_API_KEY;
    const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY;

    if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
      return NextResponse.json(
        { error: "Pinata API keys not configured. Add PINATA_API_KEY and PINATA_SECRET_KEY to .env.local" },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Build a new FormData for the Pinata API
    const pinataFormData = new FormData();
    pinataFormData.append("file", file);

    // Optional: add metadata for better organization in Pinata dashboard
    const metadata = JSON.stringify({
      name: file.name,
      keyvalues: {
        app: "evidence-locker",
        uploadedAt: new Date().toISOString(),
      },
    });
    pinataFormData.append("pinataMetadata", metadata);

    // Pin file to IPFS via Pinata
    const pinataRes = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_KEY,
      },
      body: pinataFormData,
    });

    if (!pinataRes.ok) {
      const errorText = await pinataRes.text();
      console.error("Pinata upload failed:", errorText);
      return NextResponse.json(
        { error: "Failed to upload to IPFS via Pinata" },
        { status: 502 }
      );
    }

    const pinataData = await pinataRes.json();

    return NextResponse.json({
      cid: pinataData.IpfsHash,
      pinSize: pinataData.PinSize,
      timestamp: pinataData.Timestamp,
    });
  } catch (error) {
    console.error("IPFS upload error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
