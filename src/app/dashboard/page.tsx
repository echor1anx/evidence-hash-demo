"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { ICase } from "@/models/Case";
import { Plus, ArrowRight, FileText, Search, Clock } from "lucide-react";

import AdminDashboard from "@/components/dashboard/AdminDashboard";
import InvestigatorDashboard from "@/components/dashboard/InvestigatorDashboard";
import CustodianDashboard from "@/components/dashboard/CustodianDashboard";
import AnalystDashboard from "@/components/dashboard/AnalystDashboard";
import AuditorDashboard from "@/components/dashboard/AuditorDashboard";
import { ShieldAlert } from "lucide-react";

export default function UserDashboard() {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [cases, setCases] = useState<ICase[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        const fetchCases = async () => {
            try {
                const response = await fetch("/api/cases");
                if (response.ok) {
                    const data = await response.json();
                    setCases(data);
                } else {
                    console.error("Failed to load cases");
                }
            } catch (error) {
                console.error("Error fetching cases:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchCases();
        }
    }, [user]);

    if (authLoading || loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[#020617]">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                    <p className="text-blue-400 font-mono text-sm uppercase tracking-widest">Syncing Ledger...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const renderDashboard = () => {
        switch (user.role) {
            case "Admin":
                return <AdminDashboard user={user} cases={cases} />;
            case "Investigator":
                return <InvestigatorDashboard user={user} cases={cases} />;
            case "Custodian":
                return <CustodianDashboard user={user} cases={cases} />;
            case "Analyst":
                return <AnalystDashboard user={user} cases={cases} />;
            case "Auditor":
                return <AuditorDashboard user={user} cases={cases} />;
            default:
                return (
                    <div className="min-h-screen bg-[#020617] pt-32 pb-12 flex justify-center">
                        <div className="max-w-md w-full text-center p-8 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl">
                            <ShieldAlert size={48} className="mx-auto text-red-400 mb-6" />
                            <h2 className="text-2xl font-bold text-white mb-2">Unrecognized Clearance</h2>
                            <p className="text-slate-400">Your assigned role {user.role ? `(${user.role})` : ""} is not recognized by the dashboard router. Please contact system administration.</p>
                        </div>
                    </div>
                );
        }
    }

    return (
        <div className="min-h-screen bg-[#020617] pt-24 pb-12 px-6">
            <div className="max-w-[1400px] mx-auto">
                {renderDashboard()}
            </div>
        </div>
    );
}

