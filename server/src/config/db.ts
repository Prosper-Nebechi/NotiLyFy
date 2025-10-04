import mongoose from "mongoose"

export async function connectDB(): Promise<void> {
    const uri = process.env.MONGO_URI;
    if (!uri) {
        console.error("MONGO_URI not set in environment");
        process.exit(1);
    }
    try{
        await mongoose.connect(uri, { dbName: "notificacion" });
        console.log("✅ MongoDB connected")
    }catch (err) {
        console.error("❌ MongoDB connection error: ", err);
        process.exit(1);
    }
}