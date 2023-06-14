import { Router } from "express";
import { auth } from "../../middlewares/authMiddleware";
import { initiateChatRoom, listOfChatrooms, listRoomMessages, readMessageNotification, sendMessage, unReadMessageNotification } from "../../controllers/chats";
import upload from "../../utils/fileStorage";

const route = Router()

route.get('/initiate-chatroom', auth, initiateChatRoom)
route.get('/list-chatrooms', auth, listOfChatrooms)
route.get('/chatroom/:roomId', auth, listRoomMessages)
route.get('/chat-notification/:roomId', auth, unReadMessageNotification)
route.post('/send-message', auth, upload.array('attachments'), sendMessage)
route.patch('/read-notification/:roomId', auth, readMessageNotification)
// route.get()

export default route