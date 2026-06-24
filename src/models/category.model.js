import mongoose from "mongoose";


const categorySchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        icon: {
            type: String,
        },
        color: {
            type: String
        }
    },
    {
        timestamps: true
    }
)


export const Category = mongoose.model('Category', categorySchema)