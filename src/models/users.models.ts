import { Document, Schema, model } from 'mongoose';

export interface IUser extends Document {
  username: string;
  password: string;
  email: string;
  phone: number;
  isAdmin: boolean;
  isBanned: boolean;
  avatar: string;
  address: string;
}

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isBanned: {
    type: Boolean,
    default: false
  },
  avatar: {
    type: String,
    default: function(this:IUser){
        return `https://ui-avatars.com/api/?name=${this.username}&background=random&color=random`;
      },
  },
  address: {
    type: String
  },
});

const User = model<IUser>('users', userSchema);
export default User;
