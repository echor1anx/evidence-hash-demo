import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_do_not_use_in_prod';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('evidence_auth_token')?.value;

        if (!token) {
            return NextResponse.json({ user: null }, { status: 401 });
        }

        // Verify token
        const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));

        // Connect to DB and fetch latest user info 
        // (useful to verify if they got unapproved mid-session)
        await dbConnect();
        const user = await User.findById(payload.userId);

        if (!user || user.status !== 'approved') {
            // Return null if deleted or status changed to pending/rejected
            return NextResponse.json({ user: null }, { status: 401 });
        }

        return NextResponse.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                organization: user.organization
            }
        });
    } catch (error) {
        // Token is invalid/expired
        return NextResponse.json({ user: null }, { status: 401 });
    }
}
