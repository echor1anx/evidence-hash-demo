export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { Buffer } from "buffer";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json(
      { error: "No file uploaded" },
      { status: 400 }
    );
  }

  // Convert uploaded file to raw bytes
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Generate SHA-256 hash
  const hash = createHash("sha256")
    .update(buffer)
    .digest("hex");

  return NextResponse.json({
    fileName: file.name,
    fileSize: file.size,
    hashAlgorithm: "SHA-256",
    hash,
    uploadedAt: new Date().toISOString(),
  });
}