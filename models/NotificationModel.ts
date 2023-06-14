import mongoose from "mongoose";
import { NotificationsProps } from "../types";

const schema = new mongoose.Schema<NotificationsProps>({
    roomId: {
        type: String,
        required: true
    },
    senderId: {
        type: String,
        required: true
    },
    messageId: {
        type: String,
        required: true
    },
    isRead: {
            type: Boolean,
            default: false
        }
}, { timestamps: true })

export default mongoose.model('Notifications', schema)