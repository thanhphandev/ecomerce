import { Request, Response, NextFunction } from 'express';
import sendResponseSuccess from '../helpers/responseHelpers';
import User, { IUser } from '../models/users.models';
import Product, { IProduct } from '../models/products.models';
import { CustomError } from '../common/errorObject';
import { HTTPStatus } from '../common/httpStatus';

const buildUserFilter = (fields: { [key: string]: any }): { [key: string]: any } => {
    const { query, username, email } = fields;

    const searchPattern = new RegExp(query || '', 'i');

    return {
        $or: [
            { username: new RegExp(username || searchPattern, 'i') },
            { email: new RegExp(email || searchPattern, 'i') },
        ],
    };
};

const buildProductFilter = (fields: { [key: string]: any }): { [key: string]: any } => {
    const { productName, categoryName, priceFrom, priceTo } = fields;

    const filter: { [key: string]: any } = {};

    if (productName) {
        filter.$or = [
            { productName: new RegExp(productName, 'i') },
            { categoryName: categoryName },
        ];
    }

    if (categoryName) {
        filter.categoryName = categoryName;
    }

    if (priceFrom !== undefined || priceTo !== undefined) {
        filter.price = {};
        if (priceFrom !== undefined) {
            filter.price.$gte = priceFrom;
        }
        if (priceTo !== undefined) {
            filter.price.$lte = priceTo;
        }
    }

    return filter;
};




const searchUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const filter = buildUserFilter(req.query);
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

const searchProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const filter = buildProductFilter(req.query);
        const products: IProduct[] = await Product.find(filter).select('productName categoryName price').populate('categoryName');;

        if (!products || products.length === 0) {
            throw new CustomError('No suitable products found', HTTPStatus.NOT_FOUND);
        }

        sendResponseSuccess(res, {
            message: 'List of suitable products',
            data: products,
        });
    } catch (error) {
        next(error);
    }
};

export {
    searchUser,
    searchProduct,
};
