import { Document, Schema, model } from "mongoose";

interface ICategory extends Document{
    name: string,
    decribe: string,
}

const CategorySchema = new Schema<ICategory>({
    name: String,
    decribe: String
})

const Category = model<ICategory>('category', CategorySchema)
export default Category;

