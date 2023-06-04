import { customAlphabet } from "nanoid/async"
const nanoid = customAlphabet('1234567890', 10)

export const generateCode = async () => {
    return await nanoid(4)
}