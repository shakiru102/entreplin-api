import mongoose from "mongoose";
import { ChatRoomProps } from "../types";

const schema = new mongoose.Schema<ChatRoomProps>({
    members: {
        type: Array,
        required: true
    },
    buisnessId: {
        type: String,
    }
}, { timestamps: true });

const ChatRoom = mongoose.model('chatroom', schema)

export default ChatRoom
