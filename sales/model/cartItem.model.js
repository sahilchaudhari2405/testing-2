import mongoose from "mongoose";

const Offline_cartItemSchema = new mongoose.Schema({
  // cart: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "cart",
  //   required: true,
  // },
  
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",
    required: true,
  },
  // name:{
  //   type:String,
  //   required: true,
  // },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  OneUnit:{
  type:Number,
  required:true,
  },
  price: {
    type: Number,
    required: true,
  },
  discountedPrice: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    default:'normal',
  },
  GST:{
    type:Number,
    required:true,
  },
  finalPrice_with_GST:{
  type:Number,
  required:true,
  },
  userId: {
    type:mongoose.Schema.Types.ObjectId,
        ref:"CounterUser",
        required: true,
  },

});



export default Offline_cartItemSchema;
