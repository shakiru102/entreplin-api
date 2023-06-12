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
    availability: {
        type: String,
    },
    country: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    conditions: {
        type: Array,
        default: []
    },
    authorId: {
            type: String,
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
    ],
    createdAt: {
        type: Date,
        default: Date.now()
    }    

})

export default mongoose.model<SupportProps>('Supports', schema)