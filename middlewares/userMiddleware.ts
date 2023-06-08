import { NextFunction, Request, Response } from "express"
import { locationValidate, passwordValidate, updateUserPasswordValidate } from "../utils/joi"

export const passwordValidations = (req: Request, res: Response, next: NextFunction) => {
    const { error } = passwordValidate(req.body)
    if(error) return res.status(400).send({ error: error.details[0].message })
    next()
  }
  export const locationdValidations = (req: Request, res: Response, next: NextFunction) => {
    const { error } = locationValidate(req.body)
    if(error) return res.status(400).send({ error: error.details[0].message })
    next()
  }  
  export const updateUserPasswordValidations = (req: Request, res: Response, next: NextFunction) => {
    const { error } = updateUserPasswordValidate(req.body)
    if(error) return res.status(400).send({ error: error.details[0].message })
    next()
  }  

 