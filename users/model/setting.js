import mongoose from 'mongoose'
const InvoiceLanguageSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Title in the respective language
  address: { type: String, required: true }, // Address in the respective language
  customerService: { type: String, required: true }, // Customer service contact
  phone: { type: String, required: true }, // Phone number
  email: { type: String, required: true }, // Email address
});

const InvoiceSettingsSchema = new mongoose.Schema({
  language: {
    english: InvoiceLanguageSchema,
    marathi: InvoiceLanguageSchema,
  },
  Logo:{
    type:String,
  },
  
  displayOptions: {
    email:{ type: Boolean, default: true },
    address:{ type: Boolean, default: true },
    mobileNumber:{ type: Boolean, default: true },
    showLogo: { type: Boolean, default: true },
    showTotalPrice: { type: Boolean, default: true },
    showDiscount: { type: Boolean, default: true },
    showGST: { type: Boolean, default: true },
    showPayType: { type: Boolean, default: true },
    showQR: { type: Boolean, default: true },
  },
  productDataVisibility: {
    unitPrice: { type: Boolean, default: true },
    GST: { type: Boolean, default: true },
    Discount: { type: Boolean, default: true },
    price: { type: Boolean, default: true },
  },
}, { timestamps: true });



export default InvoiceSettingsSchema;
