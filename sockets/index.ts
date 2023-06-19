import { Socket } from "socket.io"
import { DiscussionsProps, MessagesProps } from "../types";
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



    // Dicussion Forum

    // initialize Forum
    socket.on('dicussion-initialize', (res: DiscussionsProps['forumId']) => {
        socket.join(res as string)
    })
  //  Send Post Notification to Forum
    socket.on('discussion', async (res: { forumId: string; authorName: string }) => {
         const { forumId, authorName } = res
          const message = `${ authorName } created a new discussion`
          socket.broadcast.to(forumId as string).emit('discussion-post', message)
    })


//    Disconnect from server
    socket.on('disconnect', () => {
        onlineUsers = onlineUsers.filter(user => user.onlineId !== socket.id)
        io.emit('onlineUsers', onlineUsers)
    })

  })
}