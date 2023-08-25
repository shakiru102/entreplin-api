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
                        fullName: {
                            type: String
                        },
                        email: {
                            type: String
                        },
                        state: {
                            type: String
                        },
                        country: {
                            type: String
                        },
                        phoneNumber: {
                            type: String
                        },
                        picture: {
                          type: String
                        }
                    }
                }
            ],
            authorId: {
                type: String
            },
            meta_data: {
                fullName: {
                    type: String
                },
                email: {
                    type: String
                },
                state: {
                    type: String
                },
                country: {
                    type: String
                },
                phoneNumber: {
                    type: String
                },
                picture: {
                  type: String
                }
            }
        }
    ],
    authorId: {
        type: String
    },
    forumId: {
        type: String
    },
    meta_data: {
        fullName: {
            type: String
        },
        email: {
            type: String
        },
        state: {
            type: String
        },
        country: {
            type: String
        },
        phoneNumber: {
            type: String
        },
        picture: {
          type: String
        }
    }
}, { timestamps: true });

export default mongoose.model<DiscussionsProps>("forum posts", schema);