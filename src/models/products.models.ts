import mongoose, { Document, Schema, model } from "mongoose";

interface IProduct extends Document {
  name: string;
  category: mongoose.Schema.Types.ObjectId; // Assuming category is of type ObjectId
  describe: string;
  price: number;
  quantity: number; 
}

const ProductSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'category',
    required: true,
  },
  describe: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const Product = model<IProduct>('product', ProductSchema);
export default Product;
