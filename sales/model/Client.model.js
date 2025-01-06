import mongoose from 'mongoose';

const ClosingBalanceSchema = new mongoose.Schema({
  monthYear: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    required: true,
    default: 0,
  }
});

const ClientPurchaseSchema = new mongoose.Schema({
  monthYear: {
    type: String,
    required: true,
  },
  Purchase: {
    type: Number,
    required: true,
    default: 0,
  }
});

const clientSchema = new mongoose.Schema({
  Type: {
    type: String,
    required: true,
    enum: ['Client', 'Supplier'],
  },
  Name: {
    type: String,
    required: true,
    default: "Shrigonda"
  },
  Email:{
    type: String,
  },
  Address: {
    type: String,
    required: true,
    default: "Maharastra"
  },
  State: {
    type: String,
    required: true,
  },
  Mobile: {
    type: Number,
    required: true,
  },
  ClosingBalance: [{
    type:mongoose.Schema.Types.ObjectId,
    ref: "ClosingBalance",

    required: true,  
}],  
  CompletePurchase: [{
    type:mongoose.Schema.Types.ObjectId,
    ref: "ClientPurchase",

    required: true,  
}],  
  totalCompletePurchase: {
    type: Number,
    required: true,
    default: 0,
  },
  totalClosingBalance: {
    type: Number,
    required: true,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
}, 
updatedAt: {
    type: Date,
},
});
clientSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});


export {
  clientSchema,ClosingBalanceSchema,ClientPurchaseSchema,
};
