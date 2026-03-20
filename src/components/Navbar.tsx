"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Shield, ShieldAlert, BadgeCheck, Layers, LogOut, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { connectWallet, getConnectedAddress } from "@/lib/contract";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Check if wallet is already connected on mount
  useEffect(() => {
    const checkWallet = async () => {
      const address = await getConnectedAddress();
      if (address) setWalletAddress(address);
    };
    checkWallet();

    // Listen for account changes
    if (typeof window !== "undefined" && (window as any).ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        setWalletAddress(accounts[0] || null);
      };
      (window as any).ethereum.on("accountsChanged", handleAccountsChanged);
      return () => {
        (window as any).ethereum?.removeListener("accountsChanged", handleAccountsChanged);
      };
    }
  }, []);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    try {
      const address = await connectWallet();
      setWalletAddress(address);
    } catch (err: any) {
      console.error(err);
      alert("Failed to connect MetaMask. Make sure the extension is installed.");
    } finally {
      setIsConnecting(false);
    }
  };

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const getRoleIcon = () => {
    switch (user.role) {
      case "Investigator": return <Shield className="text-blue-400" size={18} />;
      case "Custodian": return <ShieldAlert className="text-yellow-500" size={18} />;
      case "Analyst": return <Layers className="text-purple-400" size={18} />;
      case "Auditor": return <BadgeCheck className="text-green-400" size={18} />;
      default: return <Shield className="text-slate-400" size={18} />;
    }
  };

  return (
    <nav className="fixed top-0 w-full bg-[#020617]/80 backdrop-blur-md border-b border-white/5 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          <div className="flex items-center gap-3">
            <Link href="/cases" className="flex items-center gap-2">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                <Shield className="text-white" size={18} />
              </div>
              <span className="text-lg font-bold tracking-tight text-white italic hidden sm:block">CUSTODY<span className="text-blue-500 text-xs">.chain</span></span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {/* MetaMask Connect Button */}
            {walletAddress ? (
              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-emerald-400 text-xs font-mono font-bold">
                  {truncateAddress(walletAddress)}
                </span>
              </div>
            ) : (
              <button
                onClick={handleConnectWallet}
                disabled={isConnecting}
                className="flex items-center gap-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 px-3 py-1.5 rounded-lg text-amber-400 text-xs font-bold transition-colors disabled:opacity-50"
              >
                <Wallet size={14} />
                <span className="hidden sm:inline">
                  {isConnecting ? "Connecting..." : "Connect Wallet"}
                </span>
              </button>
            )}

            {user.role === 'Admin' && (
              <Link
                href="/admin/requests"
                className="text-slate-400 hover:text-white transition-colors text-sm font-semibold flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10"
              >
                <ShieldAlert size={14} className="text-red-400" />
                <span className="hidden sm:inline">Admin</span>
              </Link>
            )}

            <div className="hidden md:flex flex-col items-end">
              <span className="text-xs font-bold text-white">{user.name}</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest flex items-center gap-1">
                {getRoleIcon()}
                {user.role}
              </span>
            </div>

            <div className="h-8 w-[1px] bg-white/10 hidden md:block"></div>

            <button
              onClick={handleLogout}
              className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-semibold"
            >
              <LogOut size={16} />
              <span className="hidden sm:block">Disconnect</span>
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}
