import User, { IUser } from "../models/users.models";
import { Request, Response, NextFunction } from "express";
import { CustomError } from "../common/errorObject";
import { HTTPStatus } from "../common/httpStatus";
import sendResponseSuccess from "../helpers/responseHelpers";
import bcrypt from 'bcrypt'

class UserControllers {

    static async getAllUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await User.find({});
            if (!users || users.length === 0) {
                throw new CustomError('No Any User!', HTTPStatus.NOT_FOUND);
            }
            sendResponseSuccess(res, { message: "Fetched all users successfully", data: users });
        } catch (error) {
            next(error)
        }
    }

    static async deleteAllUser(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await User.deleteMany({});
            if (result.deletedCount === 0) {
                throw new CustomError('No users found to delete', HTTPStatus.NOT_FOUND);
            }
            sendResponseSuccess(res, { message: "Deleted all users successfully" });
        } catch (error) {
            next(error)
        }
    }
    static async updateUser(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.query.user
            if (!id) {
                throw new CustomError('Required id field!', HTTPStatus.BAD_REQUEST);
            }
            const { username, password, email, phone, isAdmin, isBanned, avatar, address } = req.body;

            if (!username || !password) {
                throw new CustomError('Required username & password field!', HTTPStatus.BAD_REQUEST);
            }

            const currentUser = await User.findById(id) as IUser

            if (username !== currentUser.username) {
                const existingUser = await User.findOne({ username });
                if (existingUser) {
                    throw new CustomError('username exists', HTTPStatus.BAD_REQUEST);
                }
            }

            if (email && email !== currentUser.email) {
                const existingEmail = await User.findOne({ email });
                if (existingEmail) {
                    throw new CustomError('email exists', HTTPStatus.BAD_REQUEST);
                }
            }

            const salt = await bcrypt.genSalt(10);
            const passwordhashed = await bcrypt.hash(password, salt);
            const updatedUser = await User.findByIdAndUpdate(
                id,
                { username, password: passwordhashed, email, phone, isAdmin, isBanned, avatar, address },
                { new: true }
            );

            if (!updatedUser) {
                throw new CustomError('User not found!', HTTPStatus.NOT_FOUND)
            }

            sendResponseSuccess(res, {
                message: 'User update successful!'
            })

        } catch (error) {
            next(error);
        }
    };


    static async getUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            if (!id) {
                throw new CustomError('Required id params', HTTPStatus.BAD_REQUEST)
            }
            const user = await User.findById(id);
            if (!user) {
                throw new CustomError('not found user', HTTPStatus.NOT_FOUND)
            }

            sendResponseSuccess(res, {
                message: 'found user',
                data: user
            })

        } catch (error) {
            next(error);
        }
    }

    static async deleteUser(req: Request, res: Response, next: NextFunction) {

        try {
            const id = req.query.user
            if (!id) {
                throw new CustomError('required id params', HTTPStatus.BAD_REQUEST)
            }

            const user = await User.findByIdAndDelete(id);
            if (!user) {
                throw new CustomError('not found user', HTTPStatus.NOT_FOUND)
            }

            sendResponseSuccess(res, {
                message: 'deleted user successful'
            })

        } catch (error) {
            next(error);
        }
    }

    static async banUser(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.query.user
            if (!id) {
                throw new CustomError('required id params', HTTPStatus.BAD_REQUEST)
            }
            const bannedUser = await User.findByIdAndUpdate(id, { isBanned: true }, { new: true });
            if (!bannedUser) {
                throw new CustomError('not found user', HTTPStatus.NOT_FOUND)
            }

            sendResponseSuccess(res, {
                message: 'banned user successful'
            })

        } catch (error) {
            next(error)
        }
    }


    static async unbanUser(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.query.user
            if (!id) {
                throw new CustomError('required id params', HTTPStatus.BAD_REQUEST)
            }
            const bannedUser = await User.findByIdAndUpdate(id, { isBanned: false }, { new: true });
            if (!bannedUser) {
                throw new CustomError('not found user', HTTPStatus.NOT_FOUND)
            }

            sendResponseSuccess(res, {
                message: 'banned user successful'
            })
        } catch (error) {
            next(error)
        }
    }

    
    
    
    
    


}
export default UserControllers;