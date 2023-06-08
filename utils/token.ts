import jwt from 'jsonwebtoken'
import { SignUpProps } from '../types'

export const encode = (email: string): string => {
    return jwt
            .sign(
                { email }, 
                process.env.JWT_SECRET as any,
                { expiresIn: '48h' }
            )
}

export const decode = (token: SignUpProps['email']) => {
    return jwt.verify(token, process.env.JWT_SECRET as any)
}