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
        counterNumber: {
            type: String,
        }
    },
    { timestamps: true }
);

const CounterUser = mongoose.model('CounterUser', CounterUserSchema);

export default CounterUser;
