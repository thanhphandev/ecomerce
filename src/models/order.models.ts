import mongoose, { Document, Schema, model } from "mongoose";

export interface IOrder extends Document {
    user_id: mongoose.Schema.Types.ObjectId;
    product: mongoose.Schema.Types.ObjectId;
    quantity: number;
    price: number;
    status: String;
    orderDate: Date;
    deliveryAddress: string;
    paymentMethod: string;
    trackingNumber?: string;
    additionalNotes?: string;
}

const OrderSchema = new Schema<IOrder>({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product'
    },
    quantity: {
        type: Number
    },
    price: {
        type: Number
    },
    status: {
        type: String,
        enum: ["success", "processing", "failed"]
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    deliveryAddress: {
        type: String
    },
    paymentMethod: {
        type: String
    },
    trackingNumber: {
        type: String
    },
    additionalNotes: {
        type: String
    }
});

const Order = model<IOrder>('orders', OrderSchema);

export default Order;
