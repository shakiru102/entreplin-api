import mongoose from "mongoose";
import { UserDeviceProps } from "../types";

const schema = new mongoose.Schema<UserDeviceProps>({
    deviceName: {
        type: String
    },
    lastSeen: {
        type: Date
    },
    oneSignalId: {
        type: String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

const UserDevice = mongoose.model<UserDeviceProps>('Devices', schema)

export default UserDevice