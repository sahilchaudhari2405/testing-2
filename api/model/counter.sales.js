import mongoose, { Schema } from "mongoose";

const offlineCounterSalesSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CounterUser",
        required: true,
    },
    dailySales: [{
        totalPrice: {
            type: Number,
            required: true,
        },
        totalDiscountedPrice: {
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
        totalItem: {
            type: Number,
            required: true,
        },
        totalPurchaseRate: {
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
        DayBill:{
            type:Number,
            default:0,
        },
        date: {
            type: Number,
            required: true,
        },
        orderDate: {
            type: Date,
            required: true,
            default: Date.now,
        },
    }],
    weekSales: [{
        totalPrice: {
            type: Number,
            required: true,
        },
        totalDiscountedPrice: {
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
        totalItem: {
            type: Number,
            required: true,
        },
        WeekBill:{
            type:Number,
            default:0,
        },
        totalPurchaseRate: {
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
        week: {
            type: String,
            required: true,
        },
        orderDate: {
            type: Date,
            required: true,
            default: Date.now,
        },
    }],
    monthTotalPrice: {
        type: Number,
        required: true,
    },
    monthTotalDiscountedPrice: {
        type: Number,
        required: true,
    },
    monthGST: {
        type: Number,
        required: true,
    },
    monthDiscount: {
        type: Number,
        required: true,
        default: 0,
    },
    monthTotalItem: {
        type: Number,
        required: true,
    },
    MonthsBill:{
        type:Number,
        default:0,
    },
    monthTotalPurchaseRate: {
        type: Number,
        required: true,
    },
    monthTotalProfit: {
        type: Number,
        required: true,
    },
    monthFinalPriceWithGST: {
        type: Number,
        required: true,
    },
    month: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
    },
},);

// Middleware to update the `updatedAt` field on save
offlineCounterSalesSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const OfflineCounterSales = mongoose.model("OfflineCounterSales", offlineCounterSalesSchema);

export default OfflineCounterSales;
