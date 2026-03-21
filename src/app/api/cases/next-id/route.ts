import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Case from "@/models/Case";
import { verifyAuth } from "@/lib/verifyAuth";

export async function GET(req: NextRequest) {
    try {
        const user = await verifyAuth(req);
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const count = await Case.countDocuments();
        const nextId = `CAS-${count + 1}`;

        return NextResponse.json({ nextId }, { status: 200 });
    } catch (error) {
        console.error("Error fetching next case id:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
