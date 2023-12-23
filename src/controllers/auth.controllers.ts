import User, { IUser } from "../models/users.models";
import { Request, Response, NextFunction } from "express";
import { CustomError } from "../common/errorObject";
import { HTTPStatus } from "../common/httpStatus";
import { retrieveData } from "../helpers/retrieve_data";
import sendResponseSuccess from "../helpers/responseHelpers";
import bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken } from "../helpers/jwt";
import { verifyRefreshToken } from "../middlewares/verify_token";
import client from "../database/redis";


export default class AuthControllers {
    static async signUp(req: Request, res: Response, next: NextFunction) {
        const { username, password, email, phone } = req.body;
        try {
            if (!username || !email) {
                throw new CustomError('required Fied username, email', HTTPStatus.BAD_REQUEST)
            }

            if (!password) {
                throw new CustomError('Required password!', HTTPStatus.BAD_REQUEST)
            }
            const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
            if (!emailRegex.test(email)) {
                throw new CustomError('Email invalid!', HTTPStatus.BAD_REQUEST);
            }

            const existingUser = await User.findOne({ username });  //check exist username
            const existingEmail = await User.findOne({ email });  //check exist email

            if (existingUser || existingEmail) {
                throw new CustomError('username or email exist!', HTTPStatus.BAD_REQUEST);
            }

            const genSalt = await bcrypt.genSalt(10);
            const passwordHashed = await bcrypt.hash(password, genSalt);
            const newUser = new User({ username, password: passwordHashed, email, phone });
            const userSaved = await newUser.save();
            const refresh_token = await generateRefreshToken(userSaved)

            res.cookie('refresh_token', refresh_token, {
                maxAge: 60 * 60 * 24 * 7,
                httpOnly: true
            })
            sendResponseSuccess(res, {
                message: 'Register successful!',
                data: retrieveData(userSaved)
            })
        } catch (error: any) {
            next(error)
        }
    }

    static async Login(req: Request, res: Response, next: NextFunction) {
        try {
            const { username, password } = req.body
            if (!username) {
                throw new CustomError('Required username', HTTPStatus.BAD_REQUEST);
            }
            if (!password) {
                throw new CustomError('Required password', HTTPStatus.BAD_REQUEST);
            }
            const user = await User.findOne({ username });
            if (!user) {
                throw new CustomError('Not found user!', HTTPStatus.NOT_FOUND);
            }

            if (user.isBanned) {
                throw new CustomError('You are banned', HTTPStatus.UNAUTHENTICATION);
            }

            const checkPassword = await bcrypt.compare(password, user.password);
            if (!checkPassword) {
                throw new CustomError('Incorrect password!', HTTPStatus.UNAUTHENTICATION);
            }
            const refresh_token = await generateRefreshToken(user)

            res.cookie('refresh_token', refresh_token, {
                maxAge: 60 * 60 * 24 * 7,
                httpOnly: true
            })
            sendResponseSuccess(res, {
                message: 'Login successful!',
                data: retrieveData(user)
            })

        } catch (error) {
            next(error);
        }
    }


    static async refreshToken(req: Request, res: Response, next: NextFunction) {
        const refresh_token = req.cookies.refresh_token;

        if (!refresh_token) {
            return next(new CustomError('Unauthentication', HTTPStatus.UNAUTHENTICATION));
        }

        try {
            const decode = verifyRefreshToken(refresh_token) as IUser;
            if (!decode || !decode.username) {
                throw new CustomError('Invalid refresh token format', HTTPStatus.UNAUTHENTICATION);
            }

            const key = decode.username.toString();

            try {
                const data = await client.get(key);
                if (!data || JSON.parse(data)?.refresh_token !== refresh_token) {
                    throw new CustomError('Invalid request! Refresh token does not match', HTTPStatus.UNAUTHENTICATION);
                }
            } catch (error) {
                return next(new CustomError('Internal Server Error', HTTPStatus.INTERNAL_SERVER_ERROR));
            }

            const newAccessToken = generateAccessToken(decode);
            const newrefresh_token = await generateRefreshToken(decode)

            res.cookie('refresh_token', newrefresh_token, {
                maxAge: 60 * 60 * 24 * 7,
                httpOnly: true
            })

            sendResponseSuccess(res, {
                message: 'Refresh token successful',
                data: {
                    access_token: newAccessToken,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    static async Logout(req: Request, res: Response, next: NextFunction) {
        try {
            const refresh_token = req.cookies.refresh_token;
            if (!refresh_token) {
                throw new CustomError('No token provided', HTTPStatus.UNAUTHENTICATION)
            }

            const decode = verifyRefreshToken(refresh_token) as IUser;
            if (!decode || !decode.username) {
                throw new CustomError('Invalid refresh token format', HTTPStatus.UNAUTHENTICATION);
            }

            const key = decode.username.toString();

            try {
                const data = await client.get(key);
                if (!data || JSON.parse(data)?.refresh_token !== refresh_token) {
                    throw new CustomError('Invalid request! Refresh token does not match', HTTPStatus.UNAUTHENTICATION);
                }
            } catch (error) {
                return next(new CustomError('Internal Server Error', HTTPStatus.INTERNAL_SERVER_ERROR));
            }
            res.clearCookie('refresh_token');
            await client.del(key)
            sendResponseSuccess(res, {
                message: 'Logout successful'
            })
        } catch (error) {
            next(error)
        }
    }




}
