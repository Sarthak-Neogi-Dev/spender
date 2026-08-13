import mongoose from 'mongoose';
import "dotenv/config";

export default async function connectDB() {
    try {
        const uri = process.env.MONGO_URI;
        if (uri) {
            await mongoose.connect(uri);
            console.log("Connected to MongoDB");
        }
        else {
            console.log("MongoDB URI not found!");
        }
    }
    catch (err) {
        console.error("MongoDB connection error:", err);
        throw err;
    }
}