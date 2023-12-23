import { Document, Schema, model } from "mongoose";

export interface ICategory extends Document{
    categoryName: string,
    description: string,
}

const CategorySchema = new Schema<ICategory>({
    categoryName: String,
    description: String
})

const Category = model<ICategory>('category', CategorySchema)
export default Category;

