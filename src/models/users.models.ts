import {Document, Schema, model} from 'mongoose';

interface IUser extends Document {
    username: string,
    password: string,
    email: string,
    phone: number,
    isAdmin: boolean
}

const userSchema = new Schema <IUser>({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
})

const User = model<IUser>('users', userSchema);
export default User