import { IUser } from "models/users.models";
import { generateAccessToken } from "./jwt";
export const retrieveData = (user:IUser) => {
    const access_token = generateAccessToken(user);
    return {
        username: user.username,
        email: user.email,
        phone: user.phone,
        access_token: access_token
    }

}