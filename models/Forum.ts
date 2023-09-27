import mongoose from "mongoose";
import { ChatRoomProps, ForumProps } from "../types";

const schema = new mongoose.Schema<ForumProps>({
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
}, { timestamps: true });

export default mongoose.model<ForumProps>('Forum', schema)