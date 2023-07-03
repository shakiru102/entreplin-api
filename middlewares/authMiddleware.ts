import { NextFunction, Request, Response } from "express";
import { emailValidate, signinValidate, signupValidate, tokenValidate } from "../utils/joi";
import { SignUpProps } from "../types";
import UserModel from "../models/UserModel";
import { passwordHash } from "../utils/hashPassword";
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

  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
  if(!token) return res.status(401).send({ error: 'No token provided' })
  const authUser = async (id: string) => {
        const user = await UserModel.findById(id, { country: 0, email: 0, password: 0, fullName: 0, picture: 0, phoneNumber: 0, state: 0 });
        return user;
      }

      const decodeToken: any = decode(token)
      if(!decodeToken) return res.status(401).send({ error: 'User unauthorized' })
      const user = await authUser(decodeToken.id)
      if(!user) return res.status(401).send({ error: 'User unauthorized' })
      if(!user.emailVerified) return res.status(401).send({ error: 'User unauthorized' })
      //  @ts-ignore
    req.userId = user._id
      next()
  } catch (error: any) {
   res.status(500).send({ error: error.message })
  }
      
 }

