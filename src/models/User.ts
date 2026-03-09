import mongoose from 'mongoose';
import { UserRole } from '@/context/AuthContext';

export interface IUser extends mongoose.Document {
    name: string;
    email: string;
    password?: string; // Optional because we don't always need to retrieve it
    role: UserRole;
    organization: string;
    department: string;
    designation: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: Date;
}

const UserSchema = new mongoose.Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false }, // Don't return password by default
    role: {
        type: String,
        required: true,
        enum: ['Investigator', 'Custodian', 'Analyst', 'Auditor', 'Admin']
    },
    organization: { type: String, required: true },
    department: { type: String, required: true },
    designation: { type: String, required: true },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
