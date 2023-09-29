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
import https from 'https'
import http from 'http'
import { Server } from "socket.io"
import socketIO from './sockets/index'
import { getCountries } from "./controllers"

env.config()

const params: CorsOptions = {
   credentials: true,
   origin: '*',
}
mongoose.connect(`${process.env.MONGODB_URI}` as string)
.then(() => console.log('database  is connected'))
.catch(err => console.log(err))

const app = express()
const Port = process.env.PORT || 3000
const server = process.env.NODE_ENV == 'production'? https.createServer(app) : http.createServer(app)

 export const io: Server = new Server(server, {
   cors: {
      origin: '*'
   }
})

socketIO(io as Server)


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

app.get('/api/countries', getCountries)
app.get('/', (req: Request, res: Response) => res.send('server is running.'))