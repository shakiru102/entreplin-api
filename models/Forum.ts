import mongoose from "mongoose";
import { ChatRoomProps } from "../types";

const schema = new mongoose.Schema<ChatRoomProps>({
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
}, { timestamps: true });

export default mongoose.model<ChatRoomProps>('Forum', schema)