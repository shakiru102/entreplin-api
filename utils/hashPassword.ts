import { SignUpProps } from "../types";
import bcrypt from 'bcrypt'

export const passwordHash = (password: SignUpProps['password']) => {
    return bcrypt.hashSync(password, 10);
}