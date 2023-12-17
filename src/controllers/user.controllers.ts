import User from "../models/users.models";
import { Request, Response, NextFunction } from "express";
import { CustomError } from "../common/errorObject";
import { HTTPStatus } from "../common/httpStatus";
import sendResponseSuccess from "../helpers/responseHelpers";

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
            if(result.deletedCount === 0){
                throw new CustomError('No users found to delete', HTTPStatus.NOT_FOUND);
            }
            sendResponseSuccess(res, { message: "Deleted all users successfully" });
        } catch (error) {
            next(error)
        }
    }

    
}
export default UserControllers;