import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        const { name, email, password, role, organization, department, designation } = await req.json();

        if (!name || !email || !password || !role) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        await dbConnect();

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: 'User with this email already exists' }, { status: 409 });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user with 'pending' status by default
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role,
            organization: organization || 'Unknown',
            department: department || 'Unknown',
            designation: designation || 'Officer',
            status: 'pending' // crucial for the approval flow
        });

        await newUser.save();

        return NextResponse.json(
            { message: 'Registration successful. Request sent to admin for approval.' },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { message: 'Internal server error', error: error.message },
            { status: 500 }
        );
    }
}
