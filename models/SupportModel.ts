import mongoose from "mongoose";
import { SupportProps } from "../types";

const schema = new mongoose.Schema<SupportProps>({
    post: { 
        type: String,
        required: true
    },
    supportType: {
        type: String,
    },
    description: {
        type: String,
    },
    address: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    endDate: {
       type: Date,
       required: true
    },
    conditions: {
        type: Array,
        default: []
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    supportStatus: {
        type: String,
        default: "Available"
    },
    images: [
        {
            imageId: {
                type: String,
            },
            url: {
                type: String,
            }
        }
    ]
}, { timestamps: true })

export default mongoose.model<SupportProps>('Supports', schema)