import { Schema } from "mongoose";

export interface SignUpProps  {
    fullName?: string;
    email: string;
    password: string;
    phoneNumber?: string;
    country?: string;
    state?: string;
    emailVerified?: boolean;
    _id?: string;
    id?: string;
    picture?: string;
    verificationCode?: string;
}

export interface SupportProps {
    post?: string;
    _id?: string;
    supportType?: string;
    description?: string;
    address?: string;
    country?: string;
    state?: string;
    availability?: string;
    conditions?: string[];
    authorId?: string;
    images?: {
        imageId: string;
        url: string;
    }[];
}

export interface TransactionProps {
    post?: string;
    transactionType?: string;
    companyName?: string;
    companyBio?: string;
    companyProducts?: string[];
    companyWebsite?: string;
    price?: number;
    companyLogo?: {
        imageId: any;
        url: any;
    };
    companyImages?: {
        imageId: any;
        url: any;
    }[];
    country?: string;
    state?: string;
    authorId?: string;
    savedUsers?: string[];
    companyAddress?: string;

}

export interface ChatRoomProps {
    members?: Schema.Types.ObjectId[];
    buisnessId?: string;
    _id?: Schema.Types.ObjectId;
    chats?: Schema.Types.ObjectId[];
}

export interface MessagesProps {
    roomId?: string;
    senderId?: string;
    text?: string;
    attachments?: {
        fileId?: string;
        url?: string;
        fileType?: string;
    }[];
    isRead?: boolean;
    recipientId?: string;
    _id?: Schema.Types.ObjectId
}

export interface ReplyProps {
    likes?: string[];
    text?: string;
    createdAt?: Date;
    authorId?: string;
    _id?: string;
    meta_data?: MetaProps
}

export interface ForumComment {
    likes?: string[];
    text?: string;
    createdAt?: Date;
    authorId?: string;
    meta_data?: MetaProps
    _id?: string;
    reply?: ReplyProps[]
}

export interface MetaProps {
    fullName?: string;
    email: string;
    phoneNumber?: string;
    country?: string;
    state?: string;
    picture?: string;
}

export interface DiscussionsProps {
   forumPost?: string;
   likes?: string[];
   comments?: ForumComment[];
   authorId?: string;
//    unReadPostMembers?: string[];
   forumId?: string;
   meta_data?: MetaProps
}

export interface ForumNotificationsProps {
    forumId?: string;
    commentId?: string;
    replyId?: string;
    receiverId?: {
        userId?: string;
        isSeen?: boolean;
    }[];
    message?: string;
    postId?: string;
}
