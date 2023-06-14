import mongoose from "mongoose";
import { MessagesProps } from "../types";

const schema = new mongoose.Schema<MessagesProps>({
    roomId: {
        type: String,
        required: true
    },
     senderId: {
        type: String,
        required: true
    },
    text: {
        type: String,
    },
    attachments: [
        {
            fileId: {
                type: String
            },
            url: {
                type: String
            },
            fileType: {
                type: String
            }
        }
    ],
    isRead: {
            type: Boolean,
            default: false
        }
}, { timestamps: true })

export default mongoose.model("messages", schema)