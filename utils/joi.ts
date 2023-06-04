import joi from 'joi'
import { SignUpProps } from '../types'

const signupSchema = joi.object<SignUpProps>({
    email: joi.string().email().required(),
    password: joi.string().required(),
    fullName: joi.string().required()
})

export const signupValidate = (data: SignUpProps) => signupSchema.validate(data); //