import mongoose from "mongoose";
import languages from "../constants/enums/lang.js";

const settingsSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },

        defaultCategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category"
        },

        defaultRating: {
            type: Number,
            min: 1,
            max: 5,
            default: 1
        },
        darkMode: {
            type: Boolean,
            default: false
        },

        language: {
            type: String,
            enum: languages,
            default: "en"
        }
    },
    {
        timestamps: true
    }
);

export const Settings = mongoose.model("Settings", settingsSchema);