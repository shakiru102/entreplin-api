import { Socket } from "socket.io"
import { DiscussionsProps, ForumNotificationsProps, MessagesProps } from "../types";
import UserModel from "../models/UserModel";

interface IMessageProps extends MessagesProps {
    receiptientId: string
}

export default (io: Socket) => {

  let onlineUsers: { 
    userId: string;
    onlineId: string;
   }[] = []

  io.on('connection', (socket: Socket) => {
 
    // Create an online instance
    socket.on('activeUser', res => {
       const isOnline = onlineUsers.find(user => user.userId === res.userId)
       if (!isOnline) onlineUsers.push({
        onlineId: socket.id,
        userId: res.userId
       })
    io.emit('onlineUsers', onlineUsers)
      
    })
   
    // send message
    socket.on('sendMessage', (res: IMessageProps) => {
        const user = onlineUsers.find(users => users.userId === res.receiptientId)
       if(user) io.to(user.onlineId).emit('receiveMessage', res)
    })



    //   Forum Activity Notification
    socket.on('activity-initiated', (res: ForumNotificationsProps) => {
      if(res.receiverId) {
        for(let userId of res.receiverId) {
          const isUser = onlineUsers.find(user => user.userId == userId.userId)
          if(isUser) io.to(isUser.onlineId).emit('acitvity', res)
        }
      }
        
    })


//    Disconnect from server
    socket.on('disconnect', () => {
        onlineUsers = onlineUsers.filter(user => user.onlineId !== socket.id)
        io.emit('onlineUsers', onlineUsers)
    })

  })
}