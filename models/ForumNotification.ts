import mongoose from "mongoose";
import { ForumNotificationsProps } from "../types";

const schema = new mongoose.Schema<ForumNotificationsProps>({
    commentId: {
        type: String
    },
    forumId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Forum"
    },
    message: {
        type: String
    },
    receiverId: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
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