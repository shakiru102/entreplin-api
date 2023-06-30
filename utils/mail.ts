import nodemailer from 'nodemailer'
// import smtpTransport from 'nodemailer-smtp-transport'
import env from 'dotenv'
env.config()

export const transporter = nodemailer.createTransport({
    // @ts-ignore
  host: process.env.EMAIL_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASSWORD
  }
})
