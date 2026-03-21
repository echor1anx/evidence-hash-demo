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

        if (user.role !== "Investigator") {
             return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        await dbConnect();

        // Fetch all other approved investigators to allow sharing cases
        const investigators = await User.find({ 
            role: "Investigator", 
            status: "approved",
            _id: { $ne: user.id } // Don't include the current user in the list
        }).select("_id name email");

        return NextResponse.json(investigators, { status: 200 });
    } catch (error) {
        console.error("Error fetching investigators:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
