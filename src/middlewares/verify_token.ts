import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../common/errorObject';
import { HTTPStatus } from '../common/httpStatus';
import { IUser } from '../models/users.models';

declare global {
  namespace Express {
    interface Request {
      userData?: IUser;
    }
  }
}

const verifyAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const SECRET_TOKEN = process.env.SECRET_ACCESS_KEY!;

  if (!authHeader) {
    return next(new CustomError('Required Access Token!', HTTPStatus.UNAUTHENTICATION));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET_TOKEN) as IUser;

    if (decoded.isBanned) {
      return next(new CustomError('You are banned', HTTPStatus.UNAUTHENTICATION));
    }

    req.userData = decoded;
    next();
  } catch (err) {
    return next(new CustomError('Token is invalid!', HTTPStatus.UNAUTHENTICATION));
  }
};




const checkAdmin = (req: Request, res: Response, next: NextFunction) => {
  verifyAccessToken(req, res, () => {
    if (req.userData && req.userData.isAdmin === true) {
      next();
    } else {
      return next(new CustomError('Insufficient permissions', HTTPStatus.UNAUTHORIZATION));
    }
  });
};

const verifyRefreshToken = (refresh_token: string,) => {
  if (typeof refresh_token !== 'string') {
    throw new CustomError('Invalid Refresh Token format', HTTPStatus.UNAUTHORIZATION);
  }
  const SECRET_TOKEN = process.env.SECRET_REFRESH_KEY!
  const decode = jwt.verify(refresh_token, SECRET_TOKEN);
  if(!decode){
    throw new CustomError('Unvalid Refresh Token', HTTPStatus.UNAUTHORIZATION);
  }
  return decode;
}


export { verifyAccessToken, checkAdmin, verifyRefreshToken };
