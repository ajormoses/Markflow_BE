import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            trim: true,
        },

        url: {
            type: String,
            required: true,
            trim: true,
        },

        category: {
            type: [String],
            required: true,
            validate: {
                validator: (value) => value.length > 0,
                message: "At least one category is required",
            },
        },

        rating: {
            type: Number,
            min: 1,
            max: 5,
        },

        imageIcon: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

export const Bookmark = mongoose.model("Bookmark", bookmarkSchema);