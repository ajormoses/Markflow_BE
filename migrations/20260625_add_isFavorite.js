import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { Bookmark } from "../src/models/bookmarks.model.js";

await mongoose.connect(process.env.MONGO_URI);

await Bookmark.updateMany(
    {
        isFavorite: { $exists: false }
    },
    {
        $set: {
            isFavorite: false
        }
    }
);

console.log("Migration complete");

process.exit(0);