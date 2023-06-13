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
    createdAt: Date;
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
    createdAt: Date;
    country?: string;
    state?: string;
    authorId?: string;
    savedUsers?: string[]

}

