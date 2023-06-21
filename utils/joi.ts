import joi from 'joi'
import { SupportProps, SignUpProps, TransactionProps, DiscussionsProps, ForumComment, ForumNotificationsProps } from '../types'

const signupSchema = joi.object<SignUpProps>({
    email: joi.string().email().required(),
    password: joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).min(8),
    fullName: joi.string().required()
})

const emailValidationSchema = joi.object<SignUpProps>({
    email: joi.string().email().required()
})
const passwordValidationSchema = joi.object<SignUpProps>({
    password: joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).min(8)
})
const locationSchema = joi.object<SignUpProps>({
    phoneNumber: joi.string().required().min(10),
    country: joi.string().required(),
    state: joi.string().required(),
})
const tokenSchema = joi.object<{ accessToken: string }>({
    accessToken: joi.string().required()
});
const signinSchema = joi.object<{ email: string, password: string }>({
    email: joi.string().required(),
    password: joi.string().required()
});
const updateUserPasswordSchema = joi.object({
    currentPassword: joi.string().required().min(8),
    newPassword: joi.string().required().min(8)
})

const supportSchema = joi.object<SupportProps>({
        post: joi.string().required(),
        supportType: joi.string().required(),
        description: joi.string().required(),
        address: joi.string().required(),
        country: joi.string().required(),
        state: joi.string().required(),
        availability: joi.string().required(),
        conditions: joi.array().items(joi.string().required()).required()
        
});

const updateSupportStatusSchema = joi.object<SupportProps>({
    _id: joi.string().required(),
    supportType: joi.string().required(),
})

const transactionSchema = joi.object<TransactionProps>({
    companyBio: joi.string().required(),
    companyName: joi.string().required(),
    companyProducts: joi.array().items(joi.string().required()).required(),
    companyWebsite: joi.string().required(),
    // price: joi.number().required(),
    post: joi.string().required(),
    transactionType: joi.string().required(),
    country: joi.string().required(),
    state: joi.string().required()
})

const forumPostSchema = joi.object<DiscussionsProps>({
    forumId: joi.string().required(),
    forumPost: joi.string().required()
})

const forumCommentSchema = joi.object<{text: string; postId: string}>({
    text: joi.string().required(),
    postId: joi.string().required()
})

const forumActivityNotificationSchema = joi.object<ForumNotificationsProps>({
    forumId: joi.string().required(),
    message: joi.string().required(),
    postId: joi.string().required(),
    receiverId: joi.array().items(joi.object({
         userId: joi.string().required()
    })).required(),
    commentId: joi.string(),
    replyId: joi.string()
})




export const signupValidate = (data: SignUpProps) => signupSchema.validate(data); //
export const emailValidate = (data: SignUpProps['email']) => emailValidationSchema.validate(data); //
export const locationValidate = (data: SignUpProps) => locationSchema.validate(data); //
export const tokenValidate = (data: string) => tokenSchema.validate(data); //
export const signinValidate = (data: SignUpProps) => signinSchema.validate(data); //
export const passwordValidate = (data: string) => passwordValidationSchema.validate(data); //
export const updateUserPasswordValidate = (data: { currentPassword: string; newPassword: string }) => updateUserPasswordSchema.validate(data); //
export const supportSchemaValidate = (data: SupportProps) => supportSchema.validate(data); //
export const updateSupportStatusValidate = (data: SupportProps) => updateSupportStatusSchema.validate(data); //
export const transactionSchemaValidate = (data: TransactionProps) => transactionSchema.validate(data); //
export const forumSchemaValidate = (data: DiscussionsProps) => forumPostSchema.validate(data); //
export const commentPostSchemaValidate = (data: object) => forumCommentSchema.validate(data); //
export const forumActivityNotificationSchemaValidate = (data: ForumNotificationsProps) => forumActivityNotificationSchema.validate(data)