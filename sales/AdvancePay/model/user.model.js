import mongoose from 'mongoose';

const CounterUserSchema = new mongoose.Schema(
    {
        fullName: {   
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
            minLength: 6,
        },
        email: {
            type: String,
            unique: true,
        },
        tenantId: {
            type: String,
            required: true,
        },
        counterNumber: {
            type: String,
            unique: true,
        },
        mobile: {
            type: Number,
            required: true,
            maxLength: 10,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },

    },
    { timestamps: true }
);



export default CounterUserSchema;
