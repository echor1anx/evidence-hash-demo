export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { Buffer } from "buffer";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

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

  // Determine file extension and create a unique file name
  const originalName = file.name;
  const ext = path.extname(originalName) || "";
  const uniqueId = uuidv4();
  const newFileName = `${uniqueId}${ext}`;

  // Ensure public/uploads directory exists
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  try {
    await mkdir(uploadDir, { recursive: true });
  } catch (err) {
    console.error("Error creating upload directory:", err);
  }

  const filePath = path.join(uploadDir, newFileName);
  
  try {
    // Write buffer to disk
    await writeFile(filePath, buffer);
  } catch (err) {
    console.error("Error writing file:", err);
    return NextResponse.json(
      { error: "Failed to persist file to disk" },
      { status: 500 }
    );
  }

  // Provide a public URL to view the file
  const fileUrl = `/uploads/${newFileName}`;

  return NextResponse.json({
    fileName: originalName,
    fileSize: file.size,
    hashAlgorithm: "SHA-256",
    hash,
    fileUrl,
    uploadedAt: new Date().toISOString(),
  });
}