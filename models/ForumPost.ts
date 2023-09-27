import mongoose from "mongoose";
import { DiscussionsProps, ReplyProps } from "../types";

const schema = new mongoose.Schema<DiscussionsProps>({
    likes: {
        type: Array
    },
    forumPost: {
        type: String
    },
    comments: [
        {
            likes: {
                type: Array
            },
            createdAt: {
                type: Date,
                default: Date.now()
            },
            text: {
                type: String
            },
            reply: [
                {
                    createdAt: {
                        type: Date,
                        default: Date.now()
                    },
                    text: {
                        type: String
                    },
                    likes: {
                        type: Array
                    },
                    authorId: {
                        type: String
                    },
                    meta_data: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "User"
                    }
                }
            ],
            authorId: {
                type: String
            },
            meta_data: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        }
    ],
    authorId: {
        type: String
    },
    forumId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Forum"
    },
    meta_data: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true });

export default mongoose.model<DiscussionsProps>("forum posts", schema);