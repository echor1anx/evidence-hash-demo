"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });
const userSchema = new mongoose_1.default.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, required: true },
    organization: { type: String },
    department: { type: String },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
}, { timestamps: true });
const User = mongoose_1.default.models.User || mongoose_1.default.model("User", userSchema);
async function run() {
    console.log("Connecting to", process.env.MONGODB_URI);
    await mongoose_1.default.connect(process.env.MONGODB_URI);
    const result = await User.findOneAndUpdate({ email: "administrator@test.com" }, { status: "approved" }, { new: true });
    console.log("Updated user:", result);
    await mongoose_1.default.disconnect();
}
run().catch(console.error);
