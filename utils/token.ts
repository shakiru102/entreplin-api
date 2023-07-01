import jwt from 'jsonwebtoken'
import { SignUpProps } from '../types'

export const encode = (id: string): string => {
    return jwt
            .sign(
                { id }, 
                process.env.JWT_SECRET as any,
                { expiresIn: '2d' }
            )
}

export const decode = (token: SignUpProps['email']) => {
    return jwt.verify(token, process.env.JWT_SECRET as any)
}