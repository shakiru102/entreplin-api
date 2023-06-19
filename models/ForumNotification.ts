import mongoose from "mongoose";
import { ForumNotificationsProps } from "../types";

const schema = new mongoose.Schema<ForumNotificationsProps>({
    commentId: {
        type: String
    },
    forumId: {
        type: String
    },
    isSeen: {
        type: Boolean,
        default: false
    },
    message: {
        type: String
    },
    receiverId: {
        type: String
    },
    replyId: {
        type: String
    },
    senderId: {
        type: String
    },
    postId: {
        type: String
    }
})

export default mongoose.model<ForumNotificationsProps>("forum notifications", schema)