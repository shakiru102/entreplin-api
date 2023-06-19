import mongoose from "mongoose";
import { DiscussionsProps } from "../types";

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
                    }
                }
            ],
            authorId: {
                type: String
            }
        }
    ],
    authorId: {
        type: String
    },
    forumId: {
        type: String
    },
    unReadPostMembers: {
        type: Array
    }
}, { timestamps: true });

export default mongoose.model<DiscussionsProps>("forum posts", schema);