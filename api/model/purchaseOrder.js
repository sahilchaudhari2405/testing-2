// models/OfflineOrder.js
import mongoose, { Schema } from "mongoose";

//import Address from "../../../apalabazar/api/src/models/address.model";


const offlinePurchaseOrderSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CounterUser",
        // required: true,
    },
    orderItems: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "products",
        },
        quantity: {
            type: Number,
        },
        purchaseRate: {
            type: Number,
            default: 0
        },
        GST: {
            type: Number,
            default: 0
        },
        AmountPaid: {
            type: Number,
            default: 0
        },
        retailPrice: {
            type: Number,
            default: 0
        },
    }],
    Address: {
     type:String,
    },
    Name: {
        type: String,
        required: true,
    },
    mobileNumber: {
        type: Number,
    },
    email: {
        type: String,
        default: 'No',
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
        borrow:{
            type:Number,
            default:0
        }
    },
    billImageURL: {
        type: String,
    },
    totalPrice: {
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
    GSTNB: {
        type:String,
     
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
    type:{
    type:String,
    default:'purchase'
    },
    AmountPaid:{
        type:Number,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
    },
});

offlinePurchaseOrderSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const OfflinePurchaseOrder = mongoose.model("offlinePurchaseOrder", offlinePurchaseOrderSchema);

export default OfflinePurchaseOrder;
