import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import app from "./app.js";

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_KEY;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;

const startServer = async () => {
    if (!MONGO_URI) {
        throw new Error("MONGO_URI is required");
    }

    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is required");
    }

    if (!CLOUDINARY_CLOUD_NAME) {
        throw new Error("CLOUDINARY_CLOUD_NAME is required");
    }
    
    if (!CLOUDINARY_API_KEY) {
        throw new Error("CLOUDINARY_API_KEY is required");
    }
    
    if (!CLOUDINARY_API_SECRET) {
        throw new Error("CLOUDINARY_API_SECRET is required");
    }

    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB");

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
};

startServer();