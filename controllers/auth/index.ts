import { Request, Response } from "express";
import { generateCode } from "../../utils/nanoid";
import { sendMail } from "../../utils/mailSender";
import { SignUpProps } from "../../types";


export const signup = async (req: Request, res: Response) => {
   try {
    // @ts-ignore
      const user: SignUpProps = req.user
      const code = await generateCode()
      const { status, message } = await sendMail(user.email, 
         'Entreplin',
         `Hi there, this is your verification code. ${code}`
         )
         if(status !== 200) throw new Error(message)
    res.status(200).send({ code })
   } catch (error: any) {
    res.status(400).send({ error: error.message })
   }
} 