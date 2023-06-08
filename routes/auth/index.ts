import  { Router } from 'express'
import { accessTokenValidations, createUserMiddleware, emailValidations, signinValidations, signupValidation } from '../../middlewares/authMiddleware'
import { forgotPasswordConfirmationEmail, resendCode, signinWithEmailAndPassword, signinWithFacebook, signinWithGoogle, signup, verifyEmaiil } from '../../controllers/auth'

const route = Router()

route.post('/signup', signupValidation, createUserMiddleware, signup)
route.post('/resendcode', emailValidations, resendCode)
route.patch('/email-verification', emailValidations, verifyEmaiil)
route.post('/google', accessTokenValidations, signinWithGoogle)
route.post('/facebook', accessTokenValidations, signinWithFacebook)
route.post('/signin/mail', signinValidations, signinWithEmailAndPassword)
route.post('/forgot-password-confirmation-mail', emailValidations, forgotPasswordConfirmationEmail)

export default route