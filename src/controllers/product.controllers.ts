import { HTTPStatus } from "../common/httpStatus";
import { CustomError } from "../common/errorObject";
import { NextFunction, Request, Response } from "express";
import Product from "../models/products.models";
import sendResponseSuccess from "../helpers/responseHelpers";
import Category, { ICategory } from "../models/category.models";

const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productName, categoryName, img, description, price, quantity } = req.body;

    // Combine validation checks
    if (!productName || !categoryName || !quantity) {
      throw new CustomError('Required product name, category, and quantity', HTTPStatus.BAD_REQUEST);
    }

    // Check if the category exists
    const existingCategory = await Category.findOne({ categoryName }) as ICategory

    if (existingCategory) {
      const savedProduct = await Product.create({
        productName,
        categoryName: existingCategory._id,
        img,
        description,
        price,
        quantity,
      });

      if (savedProduct) {
        sendResponseSuccess(res, {
          message: 'Created product successfully',
        });
      } else {
        throw new CustomError('Error occurred during operation', HTTPStatus.INTERNAL_SERVER_ERROR);
      }
    } else {
      throw new CustomError('Category not found', HTTPStatus.BAD_REQUEST);
    }
  } catch (error) {
    next(error);
  }
};


const getAllProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await Product.find({}).populate('categoryName');

    if (!products || products.length === 0) {
      throw new CustomError('No products found', HTTPStatus.NOT_FOUND);
    }

    sendResponseSuccess(res, {
      message: 'Fetch all products successful',
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

const getProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new CustomError('Required id product', HTTPStatus.BAD_REQUEST);
    }
    const product = await Product.findById(id).populate('categoryName');
    if (!product) {
      throw new CustomError('Not found product', HTTPStatus.NOT_FOUND);
    }

    sendResponseSuccess(res, {
      message: `Fetch ${product.productName} successful`,
      data: product
    })


  } catch (error) {
    next(error)
  }

}

export {
  createProduct,
  getAllProduct,
  getProduct
}