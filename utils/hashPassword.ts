import bcrypt from 'bcrypt'

export const passwordHash = (password: string) => {
    return bcrypt.hashSync(password, 10);
}
export const decodePassword = async (password: string, passwordHash: string) => {
    return await bcrypt.compare(password, passwordHash)
}