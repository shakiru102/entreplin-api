import { Request, Response } from "express";
import ChatRoom from "../../models/ChatRoomModel";
import { MessagesProps } from "../../types";
import { saveFile } from "../../utils/cloudinary";
import MessageModel from "../../models/MessageModel";
import paginatedResult from "../../utils/pagination";
import { io } from "../..";
import UserModel from "../../models/UserModel";

export const initiateChatRoom = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.userId
        const memberId = req.query.memberId
        const transactionId = req.query.transactionId
        if(!memberId) return res.status(400).send({ error: 'memberId query are not sent' })
        const isCreated = await ChatRoom.findOne({
            members: {
                $all: [userId, memberId]
            },
            ...(transactionId && { buisnessId: transactionId })
        })
        if(isCreated) return res.status(200).json(isCreated)
        const chatroom = await ChatRoom.create({
            members: [userId, memberId],
            ...( transactionId && { buisnessId: transactionId } )
        })
        if(!chatroom) return res.status(400).send({ error: 'Could not create chat'})
        return res.status(200).json(chatroom)
    } catch (error: any) {
        res.status(500).send({ error: error.message })
    }
}

export const listOfChatrooms = async (req: Request, res: Response) => {
    // @ts-ignore
    const userId = req.userId
        try {
            const chatrooms = await ChatRoom.find({
                members: {
                    $in: [userId]
                }
            })
            if(!chatrooms) return res.status(400).send({ error: 'Could not find chatrooms'})
            return res.status(200).json(chatrooms)
        } catch (error: any) {
            res.status(500).send({ error: error.message })
        }
}

export const sendMessage = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
    const userId = req.userId
    const { roomId, text } = req.body
    if(!roomId) return res.status(400).send({ error: 'Could not find chat room' })
    const files = req.files
    const attachments: MessagesProps['attachments'] = []
    if (files) {
        for (let file of files as any) {
             const { path, mimetype } = file
            const { error, savedFile } = await saveFile(path, 'chats') 
            if(error) return res.status(400).send({ error })
            attachments.push({
                fileId: savedFile?.public_id,
                url: savedFile?.secure_url,
                fileType: mimetype
            })
        }
    }
    let recipientId : string | undefined
    const chatroom = await ChatRoom.findById(roomId)
    if(chatroom) recipientId = chatroom?.members?.filter(m => m != userId)[0]
    const message = await MessageModel.create({
        senderId: userId,
        roomId,
        ...(attachments.length && { attachments }),
        ...(text && { text }),
        recipientId
    })
    if(!message) return res.status(400).send({error: 'Could not create message'})
 io.sockets.emit('sendMessage', message)
    return res.status(200).json(message)
    } catch (error: any) {
        res.status(500).send({ error: error.message })
    }
}

export const listRoomMessages = async (req: Request, res: Response) => {
   try {
    // @ts-ignore
    const userId = req.userId
     const roomId = req.params.roomId
     const page = parseInt(req.query.page as string) || 1 
    const limit = parseInt(req.query.limit as string) || 10 
     if(!roomId) return res.status(400).send({ error: 'Could not find chat room' })
     let recipientId : string | undefined
     const chatroom = await ChatRoom.findById(roomId)
     if(chatroom) recipientId = chatroom?.members?.filter(m => m != userId)[0]
     const recipient = await UserModel.findById(recipientId, { verificationCode: 0, password: 0,  })
     const messages = await MessageModel.find({ roomId })
     const data = paginatedResult(messages, page, limit)
     data.embedded.recipient = recipient
     return res.status(200).json(data)
   } catch (error: any) {
     res.status(500).send({ error: error.message })
   }
}

export const readMessageNotification = async (req: Request, res: Response) => {
    const memberId = req.query.memberId
    const roomId = req.params.roomId
    try {
        if(!memberId) return res.status(400).send({ error:'memberId query not sent' })
        const isUpdated = await MessageModel.updateMany({ roomId, senderId: memberId}, {
            $set: {
                isRead: true
            }
        })
        
       if(isUpdated.modifiedCount === 0) return res.status(400).send({ error: 'Message not updated' })
       return res.status(200).send({ message: 'Message read' })
    } catch (error: any) {
        res.status(500).send({ error: error.message })
    }
}

export const unReadMessageNotification = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.userId
        const roomId = req.params.roomId
        const notifications = await MessageModel.find({ roomId, isRead: false }, {
            attachments: 0,
            text: 0
        })
        if(!notifications) return res.status(400).send({ error: 'Could not get notifications' })
        const filteredNotifications = notifications.filter(notification => notification.senderId != userId)
        res.status(200).json(filteredNotifications)
    } catch (error: any) {
        res.status(500).send({ error: error.message })
    }
}

export const lastRoomMessage = async (req: Request, res: Response) => {
    const roomId = req.params.roomId
    try {
        const message = await MessageModel.find({ roomId })
        if(!message) return res.status(400).send({ error: 'Could not get message' })
        const lastMassage = message.slice(-1)
        return res.status(200).json(lastMassage[0])
    } catch (error: any) {
        res.status(500).send({ error: error.message })
    }
}

export const allUnreadMessageNotifications = async (req: Request, res: Response) => {
    // @ts-ignore
    const userId = req.userId
    const notifications = []
    try {
        const rooms = await ChatRoom.find({
            members: {
                $in: [ userId ]
            }
        })
        for (let room of rooms) {
            const messages = await MessageModel.find({ roomId: room._id, isRead: false }, {
                text: 0,
                attachments: 0
            })
            for (let message of messages) {
                if(message.senderId!== userId) {
                    notifications.push(message)
                }
            }
        }
        res.status(200).json(notifications)
    } catch (error: any) {
        res.status(500).send({ error: error.message })
    }
}
