/**
 * IPFS / Pinata helper utilities
 * 
 * Client-side: getIPFSUrl() to construct gateway URLs
 * Server-side upload is handled by /api/ipfs/upload route (keeps API keys off the client)
 */

/**
 * Returns the IPFS gateway URL for a given CID.
 * Files uploaded to Pinata are accessible via this URL.
 */
export function getIPFSUrl(cid: string): string {
  if (!cid) return "";
  return `https://gateway.pinata.cloud/ipfs/${cid}`;
}

/**
 * Uploads a file to IPFS via our Next.js API route (which proxies to Pinata).
 * This keeps PINATA_API_KEY / PINATA_SECRET_KEY on the server side only.
 * 
 * @param file - The File object to upload
 * @returns The IPFS CID (Content Identifier)
 */
export async function uploadToIPFS(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/ipfs/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "IPFS upload failed");
  }

  const data = await res.json();
  return data.cid;
}
