import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, required: true },
    organization: { type: String },
    department: { type: String },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);

async function run() {
    console.log("Connecting to", process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI as string);
    const result = await User.findOneAndUpdate(
        { email: "administrator@test.com" },
        { status: "approved" },
        { new: true }
    );
    console.log("Updated user:", result);
    await mongoose.disconnect();
}

run().catch(console.error);
