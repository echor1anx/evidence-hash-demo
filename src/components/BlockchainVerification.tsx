'use client';

import { useEffect, useState } from 'react';

interface BlockchainEvidence {
  evidenceId: string;
  caseId: string;
  fileHash: string;
  timestamp: string;
  currentHolder: string;
  status: string;
}

interface CustodyLog {
  from: string;
  to: string;
  timestamp: string;
  action: string;
}

export function BlockchainVerification({ txHash, evidenceId }: { txHash?: string; evidenceId?: string }) {
  const [evidence, setEvidence] = useState<BlockchainEvidence | null>(null);
  const [custody, setCustody] = useState<CustodyLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sepolia_explorer, setExplorerUrl] = useState<string>('');

  useEffect(() => {
    if (txHash) {
      const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || '';
      setExplorerUrl(`https://sepolia.etherscan.io/tx/${txHash}`);
    }
  }, [txHash]);

  const verifyEvidence = async () => {
    if (!evidenceId) {
      setError('No evidence ID provided');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/blockchain/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ evidenceId }),
      });

      if (!response.ok) {
        throw new Error('Failed to verify evidence');
      }

      const data = await response.json();
      setEvidence(data.evidence);
      setCustody(data.custody || []);
    } catch (err: any) {
      setError(err.message || 'Error verifying evidence');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Blockchain Verification</h3>

      {txHash && (
        <div className="mb-4 p-3 bg-slate-800 rounded border border-slate-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-400">
              <p className="font-mono text-xs break-all">{txHash}</p>
            </div>
            <a
              href={sepolia_explorer}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              View on Block Explorer ↗
            </a>
          </div>
        </div>
      )}

      {evidenceId && (
        <button
          onClick={verifyEvidence}
          disabled={loading}
          className="mb-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white rounded text-sm font-medium"
        >
          {loading ? 'Verifying...' : 'Verify Evidence on Blockchain'}
        </button>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-900 border border-red-700 rounded text-red-200 text-sm">
          {error}
        </div>
      )}

      {evidence && (
        <div className="space-y-4">
          <div className="bg-slate-800 rounded p-4 space-y-2">
            <h4 className="text-white font-semibold mb-3">Evidence Details</h4>
            <div className="text-sm text-slate-300 space-y-2">
              <p>
                <span className="text-slate-400">Status:</span>
                <span className="ml-2 text-green-400 font-medium">{evidence.status}</span>
              </p>
              <p>
                <span className="text-slate-400">File Hash:</span>
                <span className="ml-2 font-mono text-xs break-all">{evidence.fileHash}</span>
              </p>
              <p>
                <span className="text-slate-400">Current Holder:</span>
                <span className="ml-2 font-mono text-xs">{evidence.currentHolder.slice(0, 10)}...</span>
              </p>
              <p>
                <span className="text-slate-400">Registered:</span>
                <span className="ml-2">{new Date(parseInt(evidence.timestamp) * 1000).toLocaleString()}</span>
              </p>
            </div>
          </div>

          {custody.length > 0 && (
            <div className="bg-slate-800 rounded p-4">
              <h4 className="text-white font-semibold mb-3">Chain of Custody</h4>
              <div className="space-y-2 text-sm text-slate-300">
                {custody.map((log, i) => (
                  <div key={i} className="flex items-start space-x-2 pb-2 border-b border-slate-700 last:border-0">
                    <span className="text-slate-500 font-medium">{log.action}</span>
                    <span className="text-slate-400">
                      {new Date(parseInt(log.timestamp) * 1000).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default BlockchainVerification;
