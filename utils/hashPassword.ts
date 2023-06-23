import { SignUpProps } from "../types";
import bcrypt from 'bcrypt'

export const passwordHash = async (password: string) => {
    const salt = await bcrypt.genSalt()
    return await bcrypt.hash(password, salt);
}
export const decodePassword = async (password: string, passwordHash: string) => {
    return await bcrypt.compare(password, passwordHash)
}