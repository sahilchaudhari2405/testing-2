// models/OfflineOrder.js
import mongoose, { Schema } from "mongoose";

const offlineOrderSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CounterUser",
        // required: true,
    },
    orderItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "OfflineOrderItem",
    }],
    Name:{
        type:String,
        required:true,
    },
    mobileNumber:{
        type:Number,
    },
    email:{
        type:String,
        default:'No',
    },
    orderDate: {
        type: Date,
        required: true,
    },
    paymentType: {
        cash: {
            type: Number,
            default: 0,
        },
        Card: {
            type: Number,
            default: 0,
        },
        UPI: {
            type: Number,
            default: 0,
        },
    },
    billImageURL: {
        type: String,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    totalDiscountedPrice: {
        type: Number,
        required: true,
    },
    totalPurchaseRate: {
        type: Number,
        required: true,
    },
    GST: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
        required: true,
        default: 0,
    },
    orderStatus: {
        type: String,
        required: true,
        default: "first time",
    },
    totalItem: {
        type: Number,
        required: true,
    },
    totalProfit: {
        type: Number,
        required: true,
    },
    finalPriceWithGST: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
    },
});

offlineOrderSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const OfflineOrder = mongoose.model("OfflineOrder", offlineOrderSchema);

export default OfflineOrder;
