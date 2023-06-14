import { Socket } from "socket.io"
import { MessagesProps } from "../types";

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

//    Disconnect from server
    socket.on('disconnect', () => {
        onlineUsers = onlineUsers.filter(user => user.onlineId !== socket.id)
        io.emit('onlineUsers', onlineUsers)
    })

  })
}