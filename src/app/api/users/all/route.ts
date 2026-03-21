import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { verifyAuth } from "@/lib/verifyAuth";

export async function GET(req: NextRequest) {
    try {
        const user = await verifyAuth(req);
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        // Fetch all other approved users (excluding Admins) to allow transferring evidence
        const users = await User.find({ 
            status: "approved",
            role: { $ne: "Admin" },
            _id: { $ne: user.id } // Don't include the current user in the list
        })
        .select("_id name email role")
        .sort({ role: 1, name: 1 });

        return NextResponse.json(users, { status: 200 });
    } catch (error) {
        console.error("Error fetching all users:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
