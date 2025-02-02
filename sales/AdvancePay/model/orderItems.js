// models/OfflineOrderItem.js
import mongoose, { Schema } from "mongoose";

const offlineOrderItemSchema = new Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
    },
    purchaseRate: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        default:'normal'
      },
    CGST: {
        type: Number,
        required: true, 
    },
    SGST: {
        type: Number,
        required: true, 
    },
    totalProfit: {
        type: Number,
        required: true,
    },
    OneUnit:{
        type:Number,
        required:true,
        },
    discountedPrice: {
        type: Number,
        required: true,
    },
    finalPriceWithGST: {
        type: Number,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CounterUser",
        required: true,
    },
});



export default offlineOrderItemSchema;
