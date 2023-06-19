import mongoose from "mongoose";
import { ChatRoomProps } from "../types";

const schema = new mongoose.Schema<ChatRoomProps>({
    members: {
        type: Array,
        default: []
    }
}, { timestamps: true });

export default mongoose.model<ChatRoomProps>('forum', schema)