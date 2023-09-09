import mongoose from "mongoose";
import { ChatRoomProps } from "../types";

const schema = new mongoose.Schema<ChatRoomProps>({
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        }
    ],
    buisnessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transactions"
    },
    chats: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Messages"
    }]
}, { timestamps: true });

const ChatRoom = mongoose.model('chatroom', schema)

export default ChatRoom
