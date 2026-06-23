import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import app from "./app.js";

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_KEY;

const startServer = async () => {
    if (!MONGO_URI) {
        throw new Error("MONGO_URI is required");
    }

    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is required");
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