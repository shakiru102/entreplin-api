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
}

export interface TransactionProps {
    transactionType?: string;
    companyName?: string;
    companyBio?: string;
    companyProducts?: string[];
    companyWebsite?: string;
    price?: number;
    companyLogo?: {
        imageId: string;
        url: string;
    };
    companyImage?: {
        imageId: string;
        url: string;
    }[];
}

