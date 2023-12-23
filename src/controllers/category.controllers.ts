import { HTTPStatus } from "../common/httpStatus";
import { CustomError } from "../common/errorObject";
import { Request, Response, NextFunction } from "express";
import Category from "../models/category.models";
import sendResponseSuccess from "../helpers/responseHelpers";

const createCategory = async(req:Request, res:Response, next:NextFunction) => {
    try {
        const {categoryName, description} = req.body
        if(!categoryName){
            throw new CustomError('Required category name', HTTPStatus.BAD_REQUEST)
        }
        const existCategory = await Category.findOne({categoryName})
        if(existCategory){
            throw new CustomError('Category exists', HTTPStatus.BAD_REQUEST)
        }
        const newCategory = new Category({categoryName, description})
        const saveCategory = await newCategory.save()
        if(!saveCategory){
            throw new CustomError('error during operation', HTTPStatus.INTERNAL_SERVER_ERROR)
        }
        sendResponseSuccess(res, {
            message: 'created category successful'
        })
        
    } catch (error) {
        next(error)
    }
}

const deleteCategory = async(req:Request, res:Response, next:NextFunction) => {
    try {
        const category = req.query.category
        if(!category){
            throw new CustomError('Required category name', HTTPStatus.BAD_REQUEST)
        }

       const deleteCategory = await Category.findOneAndDelete({category})
       if(!deleteCategory){
        throw new CustomError('not found category', HTTPStatus.NOT_FOUND)
       }
        sendResponseSuccess(res, {
            message: 'created category successful'
        })
        
    } catch (error) {
        next(error)
    }
}



export {
    createCategory,
    deleteCategory
}