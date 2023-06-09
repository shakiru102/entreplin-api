import { Request, Response } from "express";
import { generateCode } from "../../utils/nanoid";
import { transporter } from "../../utils/mail";
import { SignUpProps } from "../../types";
import UserModel from "../../models/UserModel";
import { encode } from "../../utils/token";
import axios from "axios";
import { decodePassword } from "../../utils/hashPassword";


export const signup = async (req: Request, res: Response) => {
   try {
    // @ts-ignore
      const user: SignUpProps = req.user
      const code = await generateCode()
      transporter.sendMail({
         from: `${process.env.APP_USER}`,
         subject: 'Entreplin',
         to: user.email,
         html: `<p>Hi there, this is your verification code:  <strong>${code}</strong></p>`,
     }, (err, response) => {
      if(err) return res.status(400).send({ error: err });
      res.status(200).send({ code })
     })
    res.status(200).send({ message: "The verification code has been sent to your mail", code })
   } catch (error: any) {
    res.status(error.status).send({ error: error })
   }
} 

export const resendCode = async (req: Request, res: Response) => {
   const details = req.body
   try {      
      const user = await UserModel.findOne({ email: details.email})
      if(!user) throw new Error(`User not found`)
      const code = await generateCode()
         transporter.sendMail({
            from: `${process.env.APP_USER}`,
            subject: 'Entreplin',
            to: user.email,
            html: `<p>Hi there, this is your verification code: <strong>${code}</strong></p>`,
        }, (err, response) => {
         if(err) return res.status(400).send({ error: err });
         res.status(200).send({ message: "The verification code has been sent to your mail", code })
        })
         
   } catch (error: any) {
         res.status(400).send({ error: error.message })
   }
}

export const verifyEmaiil = async (req: Request, res: Response) => {
   try {
      const user = await UserModel.findOneAndUpdate(
         { email: req.body.email},
         { emailVerified: true })
         if(!user) throw new Error(`Can not find ${req.body.email}`)
         const token = encode(user._id)
         res.status(200).send({ message: 'Email verified', token })
   } catch (error: any) {
      res.status(400).send({ error: error.message })
   }
}

export const signinWithGoogle = async (req: Request, res: Response) => {
   try {
      const authUser = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${req.body.accessToken}`)
      console.log(authUser);
      if(authUser.status = 200 ){
         if(!authUser.data.email) return res.status(400).send({ error: 'User email not added to google scope' });
         const user = await UserModel.findOne({ email: authUser.data.email})
         if(user) {
            const token = encode(user._id)
            return res.status(200).send({ message: 'User is authenticated', token })
         }
            const createUser = await UserModel.create({ 
               email: authUser.data.email,
               fullName: authUser.data.name,
               picture: authUser.data.picture,
               emailVerified: true
            })
            if(!createUser) return res.status(400).send({ message: 'Could not create user' })
            const token = encode(createUser._id)
            res.status(200).send({ message:'User created', token })
      }
      
   } catch (error: any) {
      res.status(error.response.status).send(error.response.data)
   }
}

export const signinWithFacebook = async (req: Request, res: Response) => {
   try {
      const authUser = await axios.get(`https://graph.facebook.com/me?fields= "name,email,picture&access_token=${req.body.accessToken}`)
      console.log(authUser);
      if(authUser.status = 200 ){
         if(!authUser.data.email) return res.status(400).send({ error: 'User email not added to facebook scope' });
         const user = await UserModel.findOne({ email: authUser.data.email})
         if(user) {
            const token = encode(user._id)
            return res.status(200).send({ message: 'User is authenticated', token })
         }
            const createUser = await UserModel.create({ 
               email: authUser.data.email,
               fullName: authUser.data.name,
               picture: authUser.data.picture,
               emailVerified: true
            })
            if(!createUser) return res.status(400).send({ message: 'Could not create user' })
            const token = encode(createUser._id)
            res.status(200).send({ message:'User created', token })
      }
      
   } catch (error: any) {
      res.status(error.response.status).send(error.response.data)
   }
}

export const signinWithEmailAndPassword = async (req: Request, res: Response) => {
   const { email, password }: SignUpProps = req.body
   try {
      const isEmail = await UserModel.findOne({ email })
      if(!isEmail) throw new Error('Invalid email or password')
      if(!isEmail.emailVerified) throw new Error('Email not verified')
      const isPassword = await decodePassword(password, isEmail.password)
      if(!isPassword) throw new Error('Invalid email or password')
       const token = encode(isEmail._id)
       res.status(200).send({
         message: 'User is authenticated',
         token
       })

   } catch (error: any) {
      res.status(400).send({ error: error.message })
   }
}

export const forgotPasswordConfirmationEmail = async (req: Request, res: Response) => {
   const { email }: SignUpProps = req.body
   try {
      const isUser = await UserModel.findOne({ email })
      if(!isUser) throw new Error('User not found')
      const code = await generateCode()
      transporter.sendMail({
         from: `${process.env.APP_USER}`,
         subject: 'Entreplin',
         to: email,
         html: `<p>Hi there, this is your verification code: <strong>${code}</strong></p>`,
     }, (err, response) => {
      if(err) return res.status(400).send({ error: err });
      res.status(200).send({ message: "The verification code has been sent to your mail", code })
     })
      const token = encode(email)
      res.status(200).send({
         message: 'Email sent',
         code,
         token
      })
         
   } catch (error: any) {
      res.status(400).send({ error: error.message})
   }
}