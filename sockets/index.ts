import { Server, Socket } from "socket.io"
import { DiscussionsProps, ForumNotificationsProps, MessagesProps } from "../types";
import UserModel from "../models/UserModel";
import { decode } from "../utils/token";

interface IMessageProps extends MessagesProps {
    recipientId: string
}

export default (io: Server) => {

  let onlineUsers: { 
    userId: string;
    onlineId: string;
   }[] = []

  

  io
  .use(async function(socket, next){
    if (socket.handshake.query && socket.handshake.query.token){
      const token = socket.handshake.query.token
      const decodeToken: any = decode(token as string)
      if(!decodeToken) return next(new Error('Authentication error'))
      // @ts-ignore
      socket.userId = decodeToken.id
      next()
    }
    else {
      next(new Error('Authentication error'));
    }    
  })
  
  .on('connection', (socket: Socket) => {
 
      // @ts-ignore
       const isOnline = onlineUsers.find(user => user.userId === socket.userId)
       if (!isOnline) {
        onlineUsers.push({
          onlineId: socket.id,
          // @ts-ignore
          userId: socket.userId
         })
        io.emit('onlineUsers', onlineUsers)
       }
      
   
    // send message
    socket.on('sendMessage', (res: IMessageProps) => {
      const user = onlineUsers.find(users => users.userId === res.recipientId)
      if(user) io.to(user.onlineId).emit('receiveMessage', res)
    })



    //   Forum Activity Notification
    socket.on('activity-initiated', (res: ForumNotificationsProps) => {
      if(res.receiverId) {
        for(let userId of res.receiverId) {
          const isUser = onlineUsers.find(user => user.userId == userId.userId)
          if(isUser) io.to(isUser.onlineId).emit('activity', res)
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