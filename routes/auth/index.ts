import  { Router } from 'express'
import { createUserMiddleware, signupValidation } from '../../middlewares/authMiddleware'
import { signup } from '../../controllers/auth'

const route = Router()

route.post('/signup', signupValidation, createUserMiddleware, signup)


export default route