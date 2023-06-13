import mongoose from "mongoose";
import { SignUpProps } from "../types";

const schema = new mongoose.Schema<SignUpProps>({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    country: {
        type: String,
        trim: true
    },
    fullName: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        trim: true
    },
    phoneNumber: {
        type: String,
        trim: true
    },
    state: {
        type: String,
        trim: true
    },
     emailVerified: {
        type: Boolean,
        default: false
     },
     picture: {
        type: String,
        trim: true
     }
}, { timestamps: true })

export default mongoose.model<SignUpProps>("User", schema);