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
    GST: {
        type: Number,
        required: true, 
    },
    totalProfit: {
        type: Number,
        required: true,
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

const OfflineOrderItem = mongoose.model("OfflineOrderItem", offlineOrderItemSchema);

export default OfflineOrderItem;
