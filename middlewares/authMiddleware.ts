import { NextFunction, Request, Response } from "express";
import { signupValidate } from "../utils/joi";
import { SignUpProps } from "../types";
import UserModel from "../models/UserModel";
import { passwordHash } from "../utils/hashPassword";

export const signupValidation = (req: Request, res: Response, next: NextFunction) => {
   const { error } = signupValidate(req.body)
   if(error) return res.status(400).send({ error: error.details[0].message })
   next()
}

export const createUserMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
     const { email, password }: SignUpProps = req.body
     const authUser = await UserModel.findOne({ email })
     if(authUser) throw new Error('User already exists')
     const user = await UserModel.create({ 
         email, 
         password: passwordHash(password)
      })
    //   @ts-ignore
     req.user = user
     next()
    } catch (error: any) {
     res.status(400).send({ error: error.message })
    }
 } 