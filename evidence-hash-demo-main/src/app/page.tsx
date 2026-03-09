"use client";

import { useState } from "react";

type HashResult = {
  fileName: string;
  fileSize: number;
  hashAlgorithm: string;
  hash: string;
  uploadedAt: string;
};

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<HashResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data: HashResult = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
  <main className="container">
    <div className="card">
      <h1>Digital Evidence Upload</h1>
      <p className="subtitle">
        Upload image evidence and generate a cryptographic SHA-256 hash
      </p>

      <label className="file-box">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        {file ? file.name : "Choose image file"}
      </label>

      <button onClick={handleUpload} disabled={loading || !file}>
        {loading ? "Generating Hash..." : "Upload & Generate Hash"}
      </button>

      {result && (
        <div className="result">
          <h3>Evidence Metadata</h3>

          <div className="row">
            <span>File Name</span>
            <span>{result.fileName}</span>
          </div>

          <div className="row">
            <span>File Size</span>
            <span>{result.fileSize} bytes</span>
          </div>

          <div className="row">
            <span>Hash Algorithm</span>
            <span>{result.hashAlgorithm}</span>
          </div>

          <div className="hash-box">
            <span>SHA-256 Hash</span>
            <code>{result.hash}</code>
          </div>

          <div className="timestamp">
            Uploaded at: {new Date(result.uploadedAt).toLocaleString()}
          </div>
        </div>
      )}
    </div>
  </main>
)
};
