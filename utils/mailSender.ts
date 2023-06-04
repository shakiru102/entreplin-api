import Mailgun from "mailgun.js";
import formData from 'form-data';
const mailgun = new Mailgun(formData);

export const sendMail = async (to: string, subject: string, text: string) => {
    const mg = mailgun.client({
        username: 'api',
        key: process.env.MAILGUN_APIKEY as string,
    });
    const { status, message } =  await mg.messages
                .create(process.env.MAILGUN_DOMAIN as string, {
                    from: "Mailgun Sandbox <postmaster@sandbox5cf16401568e454db71273980a008be0.mailgun.org>",
                    to,
                    subject,
                    text
                })
        return { status, message }
}