import mongoose, { Schema } from "mongoose";

const totalOnlineSalesSchema = new Schema({
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
        totalRetailPrice: {
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
        totalRetailPrice: {
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
        day: {
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
    monthTotalRetailPrice: {
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
    orderDate: {
        type: Date,
        required: true,
        default: Date.now,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
    },
});


totalOnlineSalesSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const TotalOnlineSales = mongoose.model("TotalOnlineSales", totalOnlineSalesSchema);

export default TotalOnlineSales;
