import mongoose from "mongoose";
import { ForumNotificationsProps } from "../types";

const schema = new mongoose.Schema<ForumNotificationsProps>({
    commentId: {
        type: String
    },
    forumId: {
        type: String
    },
    message: {
        type: String
    },
    receiverId: [
        {
            userId: {
                type: String
            },
            isSeen: {
                type: Boolean,
                default: false
            }
        }
    ],
    replyId: {
        type: String
    },
    postId: {
        type: String
    }
}, { timestamps: true });

export default mongoose.model<ForumNotificationsProps>("forum notifications", schema)