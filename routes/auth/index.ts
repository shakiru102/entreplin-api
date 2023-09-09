import  { Router } from 'express'
import { accessTokenValidations, createUserMiddleware, emailValidations, signinValidations, signupValidation } from '../../middlewares/authMiddleware'
import { forgotPasswordConfirmationEmail, resendCode, signinWithApple, signinWithEmailAndPassword, signinWithFacebook, signinWithGoogle, signup, verifyEmaiil, verifyForgotPasswordConfirmationEmail } from '../../controllers/auth'

const route = Router()

route.post('/signup', signupValidation, createUserMiddleware, signup)
route.post('/resendcode', emailValidations, resendCode)
route.patch('/email-verification', emailValidations, verifyEmaiil)
route.post('/forgot-password-verification', emailValidations, verifyForgotPasswordConfirmationEmail)
route.post('/google', accessTokenValidations, signinWithGoogle)
route.post('/facebook', accessTokenValidations, signinWithFacebook)
route.post('/apple', signinWithApple)
route.post('/signin/mail', signinValidations, signinWithEmailAndPassword)
route.post('/forgot-password-confirmation-mail',  forgotPasswordConfirmationEmail)

export default route