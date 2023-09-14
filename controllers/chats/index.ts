import { Request, Response } from "express";
import ChatRoom from "../../models/ChatRoomModel";
import { MessagesProps } from "../../types";
import { saveFile } from "../../utils/cloudinary";
import MessageModel from "../../models/MessageModel";
import paginatedResult from "../../utils/pagination";
import { io } from "../..";
import * as OneSignal from '@onesignal/node-onesignal'
import UserModel from "../../models/UserModel";
import { send } from "process";
import { oneSignalClient } from "../../utils/oneSignal";
import TransactionModel from "../../models/TransactionModel";

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
        .populate("members", '-__v -password -verificationCode')
        .populate("buisnessId")
        .populate("chats")
        if(isCreated) return res.status(200).json(isCreated)
        const memberOne = await UserModel.findById(memberId, { password: 0, verificationCode: 0 })
        const memberTwo = await UserModel.findById(userId, { password: 0, verificationCode: 0 })
        const transaction = await TransactionModel.findById(transactionId)
        const chatroom = await ChatRoom.create({
            members: [memberOne, memberTwo],
            ...( transactionId && { buisnessId: transaction } ),
            chats: []
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
            .populate("members", '-__v -password -verificationCode')
            .populate("chats")
            .populate("buisnessId")
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

    let recipientId 
    const chatroom = await ChatRoom.findById(roomId).populate('members')
   if(!chatroom) return res.status(400).send({ error: "Could not find chat room" })

   if(chatroom.members) {
        //  @ts-ignore
        if(userId != chatroom.members[0].id) 
            // @ts-ignore
            recipientId = chatroom.members[0].id
        else 
            // @ts-ignore
            recipientId = chatroom?.members[1].id
   } 
    
   
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
   
    const recipient =  await UserModel.findById(recipientId).populate("devices", "-_id -lastSeen -deviceName -__v -userId")
    const sender =  await UserModel.findById(userId)
    let onesignalIds: string[] = []
    
    const message = await MessageModel.create({
        senderId: userId,
        roomId,
        ...(attachments.length && { attachments }),
        ...(text && { text }),
        recipientId
    })

    // @ts-ignore
   recipient?.devices?.forEach((device) =>  onesignalIds.push(device.oneSignalId))
    const notification = new OneSignal.Notification()

    notification.app_id = process.env.ONESIGNAL_APP_ID as string
    notification.included_segments = onesignalIds
    notification.contents = {
        en: message.text
    }
    notification.headings = {
        en: sender?.fullName
    }
    if(!message) return res.status(400).send({error: 'Could not create message'})
     await ChatRoom.updateOne({ _id: roomId }, {
       $push: { 
          chats: message.id
       }
    })
 io.sockets.emit('sendMessage', message)

    // const pushNotification = await oneSignalClient.createNotification(notification);
    // if(!pushNotification.errors) {
    //     console.log(pushNotification.errors);
    //     return res.status(200).json(message)
        
    // }
    
 
     res.status(200).json(message)
    } catch (error: any) {
        console.log(error);
        
        res.status(500).send({ error: error.message })
    }
}

export const listRoomMessages = async (req: Request, res: Response) => {
   try {
     const roomId = req.params.roomId
     const page = parseInt(req.query.page as string) || 1 
    const limit = parseInt(req.query.limit as string) || 10 
     if(!roomId) return res.status(400).send({ error: 'Could not find chat room' })
     const messages = await MessageModel.find({ roomId })
     const data = paginatedResult(messages, page, limit)
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
