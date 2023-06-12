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
    createdAt: {
        type: Date,
        default: Date.now()
    },
    authorId: {
        type: String,
    },
    post: {
            type: String,
        },
    country: {
        type: String,
    },
    state: {
        type: String,
    }    
})

export default mongoose.model('Transactions', schema)