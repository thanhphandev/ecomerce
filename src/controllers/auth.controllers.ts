import User from "../models/users.models";
import { Request, Response, NextFunction } from "express";
import { CustomError } from "../common/errorObject";
import { HTTPStatus } from "../common/httpStatus";
import { retrieveData } from "../helpers/retrieve_data";
import sendResponseSuccess from "../helpers/responseHelpers";
import bcrypt from 'bcrypt';


export default class AuthControllers {
    static async signUp(req: Request, res: Response, next: NextFunction) {
        const { username, password, email, phone } = req.body;
        try {
            if (!username || !email) {
                throw new CustomError('required Fied username', HTTPStatus.BAD_REQUEST)
            }

            if (!password) {
                throw new CustomError('Required password!', HTTPStatus.BAD_REQUEST)
            }
            const existsUser = await User.findOne({ username });
            if (existsUser) {
                throw new CustomError('Username existsed', HTTPStatus.BAD_REQUEST)
            }
            const genSalt = await bcrypt.genSalt(10);
            const passwordHashed = await bcrypt.hash(password, genSalt);
            const newUser = new User({ username, password: passwordHashed, email, phone });
            const userSaved = await newUser.save()
            sendResponseSuccess(res, {
                message: 'Register successful!',
                data: retrieveData(userSaved)
            })
        } catch (error: any) {
            next(error)
        }
    }

}
