import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_do_not_use_in_prod';

// Helper to verify admin status
async function verifyAdmin() {
    const cookieStore = await cookies();
    const token = cookieStore.get('evidence_auth_token')?.value;

    if (!token) return false;

    try {
        const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));

        // We strictly check the database to ensure they are STILL an admin
        await dbConnect();
        const adminUser = await User.findById(payload.userId);

        if (adminUser && adminUser.role === 'Admin' && adminUser.status === 'approved') {
            return true;
        }
        return false;
    } catch (error) {
        return false;
    }
}

export async function GET() {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
        return NextResponse.json({ message: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    await dbConnect();

    // Fetch pending users
    try {
        const pendingUsers = await User.find({ status: 'pending' }).sort({ createdAt: -1 });
        return NextResponse.json({ users: pendingUsers }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: 'Database error', error: error.message }, { status: 500 });
    }
}
