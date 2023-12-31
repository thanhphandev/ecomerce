import mongoose, { Document, Schema, model } from "mongoose";

export interface IProduct extends Document {
  productName: string;
  categoryName: mongoose.Schema.Types.ObjectId;
  img: string;
  description: string;
  price: number;
  quantity: number; 
}

const ProductSchema = new Schema<IProduct>({
  productName: {
    type: String,
    required: true,
  },
  categoryName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'category',
    required: true,
  },
  img: {
    type: String
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    default: 0
  },
  quantity: {
    type: Number,
  },
});

const Product = model<IProduct>('product', ProductSchema);
export default Product;
