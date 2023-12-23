import { Request, Response, NextFunction } from 'express'
import sendResponseSuccess from "../helpers/responseHelpers"
import User, { IUser } from "../models/users.models";
import { CustomError } from '../common/errorObject';
import { HTTPStatus } from '../common/httpStatus';


const searchUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { query, username, email } = req.query as { query?: string; username?: string; email?: string };

        const searchPattern = new RegExp(query || '', 'i');

        const filter: { $or: { username?: RegExp; email?: RegExp }[] } = {
            $or: [
                { username: new RegExp(username || searchPattern, 'i') },
                { email: new RegExp(email || searchPattern, 'i') },
            ],
        };

        const users: IUser[] = await User.find(filter).select('username email');
        if (!users || users.length === 0) {
            throw new CustomError('No suitable users found', HTTPStatus.NOT_FOUND);
        }

        sendResponseSuccess(res, {
            message: 'List of suitable users',
            data: users,
        });
    } catch (error) {
        next(error);
    }
};



export {
    searchUser
}