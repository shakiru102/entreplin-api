import mongoose from "mongoose";
import { TransactionProps } from "../types";

const schema = new mongoose.Schema<TransactionProps>({
    companyBio: {
        type: String,
    },
    companyName: {
        type: String,
    },
    companyImages: [
        {
            imageId: {
                type: String,
            },
            url: {
                type: String,
            }
        }
    ],
    companyProducts: {
        type: Array,
        default: []
    },
    companyWebsite: {
        type: String,
    },
    price: {
            type: Number,
        },
    transactionType: {
        type: String,
    },
    companyLogo: {
        imageId: {
            type: String,
        },
        url: {
            type: String,
        }
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    post: {
            type: String,
        },
    country: {
        type: String,
    },
    state: {
        type: String,
    },
    savedUsers: {
        type: Array,
        default: []
    },
    companyAddress: {
        type: String
    }    
}, { timestamps: true })

export default mongoose.model<TransactionProps>('Transactions', schema)