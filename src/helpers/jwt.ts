import jwt from 'jsonwebtoken';
import { IUser } from '../models/users.models';
import 'dotenv/config';
import client from '../database/redis';

export const generateAccessToken = (user: IUser) => {
    const access_token = jwt.sign({ id: user._id, username: user.username,isAdmin: user.isAdmin }, process.env.SECRET_ACCESS_KEY || 'xin', { expiresIn: '15m' });
    return access_token;
}


export const generateRefreshToken = async (user: IUser) => {
    const redisKey = user.username.toString();
    const refresh_token = jwt.sign({ id: user._id, username: user.username, isAdmin: user.isAdmin }, process.env.SECRET_REFRESH_KEY || 'hello', { expiresIn: '59m' });
    
    const existingRefreshToken = await client.get(redisKey);

    if (!existingRefreshToken) {
        await client.set(redisKey, JSON.stringify({ refresh_token: refresh_token }));
    } else {
        const existingTokenData = JSON.parse(existingRefreshToken);
        existingTokenData.refresh_token = refresh_token;

        await client.set(redisKey, JSON.stringify(existingTokenData));
    }

    return refresh_token;
};

