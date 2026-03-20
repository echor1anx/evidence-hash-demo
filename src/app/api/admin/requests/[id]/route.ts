import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_do_not_use_in_prod';

async function verifyAdmin() {
    const cookieStore = await cookies();
    const token = cookieStore.get('evidence_auth_token')?.value;

    if (!token) return false;

    try {
        const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
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

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
        return NextResponse.json({ message: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    try {
        const { id } = await params; // Next.js 15+ async params
        const { status } = await req.json(); // expect { status: 'approved' | 'rejected' }

        if (!['approved', 'rejected'].includes(status)) {
            return NextResponse.json({ message: 'Invalid status update' }, { status: 400 });
        }

        await dbConnect();

        const user = await User.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(
            { message: `User status successfully updated to ${status}`, user },
            { status: 200 }
        );

    } catch (error: any) {
        return NextResponse.json({ message: 'Database error', error: error.message }, { status: 500 });
    }
}
