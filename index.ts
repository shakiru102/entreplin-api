import { CorsOptions } from "cors"
import express, { Request, Response } from  'express'
import cors from 'cors'
import mongoose from 'mongoose'
import env  from 'dotenv'
import Auth from './routes/auth'
import UserRoutes from './routes/user-profile'
import SupportRoutes from './routes/support'
import TransactionRoutes from './routes/transactions'
import ForumRoutes from './routes/forum'
import ChatRoutes from './routes/chats'
import http from 'http'
import { Server } from "socket.io"
import socketIO from './sockets/index'

env.config()

const params: CorsOptions = {
   credentials: true,
   origin: '*',
}
// @ts-ignore
mongoose.connect(process.env.MONGODB_URI, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
})
.then(() => console.log('database  is connected'))
.catch(err => console.log(err))

const app = express()
const Port = process.env.PORT || 3000
const server = http.createServer(app)

 const io = new Server(server, {
   cors: {
      origin: '*'
   }
})

socketIO(io as any)


server.listen(Port, () => console.log('listening on port ' + Port))
app.use(cors(params))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api/auth', Auth)
app.use('/api/user', UserRoutes)
app.use('/api/support', SupportRoutes)
app.use('/api/transaction', TransactionRoutes)
app.use('/api/chat', ChatRoutes)
app.use('/api/forum', ForumRoutes)


app.get('/', (req: Request, res: Response) => res.send('server is running.'))