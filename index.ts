import { CorsOptions } from "cors"
import express, { Request, Response } from  'express'
import cors from 'cors'
import mongoose from 'mongoose'
import env  from 'dotenv'

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
app.listen(Port, () => console.log('listening on port ' + Port))
app.use(cors(params))


app.get('/', (req: Request, res: Response) => res.send('server is running.'))