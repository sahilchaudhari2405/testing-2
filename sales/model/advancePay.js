const mongoose = require('mongoose');

const AdvancePaySchema = new mongoose.Schema({
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client",
        required: true,
    },
    cart: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Offline_Cart",
        required: true,
    }],
    status: {
        type: String,
        enum: ['pending', 'complete'],
        default: 'pending',
    },
    advancePay: [
        {
            amount: {
                type: Number,
                default: 0,
            },
            date: {
                type: String,
                required: true,
            },
            time: {
                type: String,
                required: true,
            },
        }
    ],
}, { timestamps: true });

export default AdvancePaySchema;
