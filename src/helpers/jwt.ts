import jwt from 'jsonwebtoken'
import { IUser } from 'models/users.models'
import 'dotenv/config'
export const generateAccessToken = (user:IUser) => {
    const access_token = jwt.sign({id: user._id, isAdmin: user.isAdmin}, process.env.SECRET_ACCESS_KEY!, {expiresIn: '20m'});
    return access_token;
}