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
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Category"
                }
            ],
            required: true,
            validate: {
                validator: (value) => Array.isArray(value) && value.length > 0,
                message: "At least one category is required",
            },
        },

        rating: {
            type: Number,
            min: 1,
            max: 5,
        },

        logo: {
            url: {
                type: String
            },
            publicId: {
                type: String
            }
        },

        isFavorite: {
            type: Boolean,
            default: false,
        },

        visitCount: {
            type: Number,
            default: 0
        },
    },
    {
        timestamps: true,
    }
);

export const Bookmark = mongoose.model("Bookmark", bookmarkSchema);