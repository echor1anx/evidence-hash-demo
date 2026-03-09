"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/AuthLayout';
import { CheckCircle, XCircle, Clock, ShieldAlert } from 'lucide-react';

type PendingUser = {
    _id: string;
    name: string;
    email: string;
    role: string;
    organization: string;
    department: string;
    createdAt: string;
};

export default function AdminRequestsPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [requests, setRequests] = useState<PendingUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // Wait for auth to load
        if (isLoading) return;

        if (!user || user.role !== 'Admin') {
            router.push('/cases'); // Redirect non-admins
            return;
        }

        fetchRequests();
    }, [user, isLoading, router]);

    const fetchRequests = async () => {
        try {
            const res = await fetch('/api/admin/requests');
            if (!res.ok) throw new Error('Failed to fetch requests');
            const data = await res.json();
            setRequests(data.users);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id: string, action: 'approved' | 'rejected') => {
        if (!confirm(`Are you sure you want to ${action === 'approved' ? 'APPROVE' : 'REJECT'} this request?`)) return;

        try {
            const res = await fetch(`/api/admin/requests/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: action })
            });

            if (!res.ok) throw new Error('Action failed');

            // Remove the user from the list
            setRequests(prev => prev.filter(req => req._id !== id));
            alert(`User ${action} successfully.`);
        } catch (err: any) {
            alert(err.message);
        }
    };

    if (isLoading || loading) {
        return (
            <AuthLayout title="Admin Command" description="Verifying credentials...">
                <div className="flex justify-center p-8">
                    <Clock className="animate-spin text-blue-500" size={32} />
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout title="Access Requests" description="Review pending blockchain access applications.">
            <div className="space-y-6">
                {error && (
                    <div className="bg-red-500/10 text-red-400 p-4 rounded-xl border border-red-500/20 text-sm">
                        {error}
                    </div>
                )}

                {requests.length === 0 ? (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center flex flex-col items-center gap-3">
                        <ShieldAlert className="text-slate-500" size={48} />
                        <h3 className="text-white font-bold">No Pending Requests</h3>
                        <p className="text-slate-500 text-sm">All personnel access applications have been processed.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {requests.map((req) => (
                            <div key={req._id} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-white font-bold">{req.name}</h3>
                                    <p className="text-slate-400 text-sm mb-2">{req.email}</p>
                                    <div className="flex flex-wrap gap-2 text-[10px] font-mono tracking-wider uppercase">
                                        <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-md">{req.role}</span>
                                        <span className="bg-white/10 text-slate-300 px-2 py-1 rounded-md">{req.organization}</span>
                                        <span className="bg-white/10 text-slate-300 px-2 py-1 rounded-md">{req.department}</span>
                                    </div>
                                </div>

                                <div className="flex gap-2 mt-4 md:mt-0">
                                    <button
                                        onClick={() => handleAction(req._id, 'rejected')}
                                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl transition-colors text-sm font-bold"
                                    >
                                        <XCircle size={16} /> Reject
                                    </button>
                                    <button
                                        onClick={() => handleAction(req._id, 'approved')}
                                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30 rounded-xl transition-colors text-sm font-bold"
                                    >
                                        <CheckCircle size={16} /> Approve
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AuthLayout>
    );
}
