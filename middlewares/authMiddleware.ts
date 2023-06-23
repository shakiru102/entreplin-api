import { NextFunction, Request, Response } from "express";
import { emailValidate, signinValidate, signupValidate, tokenValidate } from "../utils/joi";
import { SignUpProps } from "../types";
import UserModel from "../models/UserModel";
import { passwordHash } from "../utils/hashPassword";
import axios from "axios";
import { decode } from "jsonwebtoken";

export const signupValidation = (req: Request, res: Response, next: NextFunction) => {
   const { error } = signupValidate(req.body)
   if(error) return res.status(400).send({ error: error.details[0].message })
   next()
}

export const createUserMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
     const { email, password, fullName }: SignUpProps = req.body
     const authUser = await UserModel.findOne({ email })
     if(authUser) return res.status(400).send({ error: "User already exists" })
     const user = await UserModel.create({ 
         email, 
         password: passwordHash(password),
         fullName
      })
    //   @ts-ignore
     req.user = user
     next()
    } catch (error: any) {
     res.status(500).send({ error: error.message })
    }
 } 

 export const emailValidations = (req: Request, res: Response, next: NextFunction) => {
   const { error } = emailValidate(req.body)
   if(error) return res.status(400).send({ error: error.details[0].message })
   next()
 }


 export const accessTokenValidations = (req: Request, res: Response, next: NextFunction) => {
   const { error } = tokenValidate(req.body)
   if(error) return res.status(400).send({ error: error.details[0].message })
   next()
 }

 export const signinValidations = (req: Request, res: Response, next: NextFunction) => {
    const { error } = signinValidate(req.body)
    if(error) return res.status(400).send({ error: error.details[0].message })
    next()
 }

 export const auth = async (req: Request, res: Response, next: NextFunction) => {

  const token = req.headers.authorization?.replace('Bearer ', '')
  if(!token) return res.status(401).send({ error: 'No token provided' })
  const authUser = async (email: string) => {
        const user = await UserModel.findOne({ email });
        return user;
      }

      await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`)
      .then(async (response) => {
           const { email } = response.data
           const user = await authUser(email)
           if (!user) return res.status(401).send({ error: 'User unauthorized' })  
          //  @ts-ignore
           req.userId = user.id
           next()
      })

      .catch(async () => {
          await axios.get(`https://graph.facebook.com/me?fields= "email&access_token=${token}`)
          .then(async (response) => {
              const { email } = response.data
              const user = await authUser(email)
              if (!user) return res.status(401).send({ error: 'User unauthorized'})  
              //  @ts-ignore
              req.userId = user.id
              next()
          })

         .catch(async () => {
             const decodeToken: any = decode(token)
             if(!decodeToken) return res.status(401).send({ error: 'User unauthorized' })
             const user = await authUser(decodeToken.email)
             if(!user) return res.status(401).send({ error: 'User unauthorized' })
             if(!user.emailVerified) return res.status(401).send({ error: 'User unauthorized' })
             //  @ts-ignore
            req.userId = user.id
             next()
         })
      })
      
 }

