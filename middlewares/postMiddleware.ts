import { NextFunction, Request, Response } from "express"
import { supportSchemaValidate, updateSupportStatusValidate } from "../utils/joi"

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