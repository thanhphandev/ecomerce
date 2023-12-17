import { Response } from "express";
import { HTTPStatus } from "../common/httpStatus";

interface ResponseData {
    status?: string;
    statusCode?: number;
    data?: any;
    message?: string;
}

const sendResponseSuccess = (res: Response, responseData: ResponseData = {}): Response => {
    const { status = 'Success', statusCode = HTTPStatus.OK, data, message } = responseData;

    const responsePayload: { [key: string]: any } = {
        status,
    };

    if (message !== undefined) {
        responsePayload.message = message;
    }

    if (data !== undefined) {
        responsePayload.data = data;
    }

    return res.status(statusCode).json(responsePayload);
};

export default sendResponseSuccess;
