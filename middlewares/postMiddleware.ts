import { NextFunction, Request, Response } from "express"
import { commentPostSchemaValidate, forumSchemaValidate, supportSchemaValidate, transactionSchemaValidate, updateSupportStatusValidate } from "../utils/joi"

export const supportSchemaValidations = (req: Request, res: Response, next: NextFunction) => {
    const { error } = supportSchemaValidate(req.body)
    if(error) return res.status(400).send({ error: error.details[0].message })
    next()
  }

export const updateSupportStatusValidations = (req: Request, res: Response, next: NextFunction) => {
    const { error } = updateSupportStatusValidate(req.body)
    if(error) return res.status(400).send({ error: error.details[0].message })
    next()
}  

export const transactionSchemaValidation = async (req: Request, res: Response, next: NextFunction) => {
    const { error } = transactionSchemaValidate(req.body)
    if(error) return res.status(400).send({ error: error.details[0].message })
    next()   
}

export const discussionPostValidations = (req: Request, res: Response, next: NextFunction) => {
    const { error } = forumSchemaValidate(req.body)
    if(error) return res.status(400).send({ error: error.details[0].message })
    next()   
}

export const commentPostValidations = (req: Request, res: Response, next: NextFunction) => {
    const { error } = commentPostSchemaValidate(req.body)
    if(error) return res.status(400).send({ error: error.details[0].message })
    next()   
}