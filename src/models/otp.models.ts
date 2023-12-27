import mongoose, { Document, Schema, model } from "mongoose"

export interface IOTP extends Document{
    user_id: mongoose.Schema.Types.ObjectId
    otp: string
    create_at: Date
    expire_in: Date
}

const OTPSchema = new Schema<IOTP>({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    otp: {
        type: String
    },
    create_at: {
        type: Date,
        default: Date.now
    },
    expire_in: {
        type: Date
    }
})

const OTP = model<IOTP>('otp', OTPSchema)
export default OTP