import mongoose from 'mongoose';

const CounterUserSchema = new mongoose.Schema(
    {
        fullName: {
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
            required: true,
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

const CounterUser = mongoose.model('CounterUser', CounterUserSchema);

export default CounterUser;
