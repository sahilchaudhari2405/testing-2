import mongoose from "mongoose";

const Offline_cartSchema = new mongoose.Schema({
    
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"CounterUser",
        required: true,
    },

    cartItems: [{
        type:mongoose.Schema.Types.ObjectId,
        ref: "OfflineCartItems",

        required: true,  
    }],  
    totalPrice: {
        type: Number,
        required: true,
        default:0
    },
   
    totalItem:{
        type: Number,
        required: true,
        default:0 
    },
    totalDiscountedPrice:{
        type: Number,
        required: true,
        default:0 
    },
    discount:{
        type: Number,
        required: true,
        default:0 
    },
    GST:{
        type:Number,
        required:true,
    },
    final_price_With_GST:{
        type:Number,
        required:true,
    }
})



export default Offline_cartSchema;
