import mongoose from 'mongoose'
const InvoiceLanguageSchema = new mongoose.Schema({
UserDetails:{
  title: { type: String, required: true }, // Title in the respective language
  address: { type: String, required: true },
  state:{ type: String, required: true },
  pin:{ type: String, required: true },
  customerService: { type: String, required: true }, // Customer service contact
  phone: { type: String, required: true }, // Phone number
  email: { type: String, },
},
BankDetails:{
  Account_Holder: { type: String, }, // Title in the respective language
  Account_Number: { type: String, },
  Bank:{ type: String, },
  Branch:{ type: String},
  IFSC: { type: String}, // Customer service contact
  UPI_ID: { type: String }, // Phone number
  GSTIN: { type: String, },
  PAN_Number:{ type: String, },
},
TermsConditions:{ type: [String]}

});

const InvoiceSettingsSchema = new mongoose.Schema({
  language: {
    english: InvoiceLanguageSchema,
    marathi: InvoiceLanguageSchema,
  },
  Logo:{
    type:String,
  },
  loyalty:{
     type:Number,
     default:0,
  },
  Sale:{
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
  },
  Purchase:{
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
  },
  GSTBill:{
    displayOptions: {
      email:{ type: Boolean, default: true },
      address:{ type: Boolean, default: true },
      mobileNumber:{ type: Boolean, default: true },
      showLogo: { type: Boolean, default: true },
      TotalTaxAmount: { type: Boolean, default: true },
      showDiscount: { type: Boolean, default: true },
      TaxableAmount: { type: Boolean, default: true },
      showPayType: { type: Boolean, default: true },
      showQR: { type: Boolean, default: true },
      Account_Holder: { type: Boolean, default: true }, // Title in the respective language
      Account_Number:{ type: Boolean, default: true },
      Bank:{ type: Boolean, default: true },
      Branch:{ type: Boolean, default: true },
      IFSC: { type: Boolean, default: true }, // Customer service contact
      UPI_ID: { type: Boolean, default: true }, // Phone number
      GSTIN: { type: Boolean, default: true },
      PAN_Number:{ type: Boolean, default: true },
      SIGN:{ type: Boolean, default: true },
      TermsConditions:{ type: Boolean, default: true },
    },
    productDataVisibility: {
      HSN: { type: Boolean, default: true },
      Tax: { type: Boolean, default: true },
      MRP: { type: Boolean, default: true },
      Discount: { type: Boolean, default: true },
      Rate: { type: Boolean, default: true },
      Amount: { type: Boolean, default: true },
    },
  },
  ContentionBill:{
    displayOptions: {
      email:{ type: Boolean, default: true },
      address:{ type: Boolean, default: true },
      mobileNumber:{ type: Boolean, default: true },
      showLogo: { type: Boolean, default: true },
      TotalTaxAmount: { type: Boolean, default: true },
      showDiscount: { type: Boolean, default: true },
      TaxableAmount: { type: Boolean, default: true },
      showPayType: { type: Boolean, default: true },
      showQR: { type: Boolean, default: true },
      Account_Holder: { type: Boolean, default: true }, // Title in the respective language
      Account_Number:{ type: Boolean, default: true },
      Bank:{ type: Boolean, default: true },
      Branch:{ type: Boolean, default: true },
      IFSC: { type: Boolean, default: true }, // Customer service contact
      UPI_ID: { type: Boolean, default: true }, // Phone number
      GSTIN: { type: Boolean, default: true },
      PAN_Number:{ type: Boolean, default: true },
      SIGN:{ type: Boolean, default: true },
      TermsConditions:{ type: Boolean, default: true },
    },
    productDataVisibility: {
      HSN: { type: Boolean, default: true },
      Tax: { type: Boolean, default: true },
      MRP: { type: Boolean, default: true },
      Discount: { type: Boolean, default: true },
      Rate: { type: Boolean, default: true },
      Amount: { type: Boolean, default: true },
    },
  }
}, { timestamps: true });



export default InvoiceSettingsSchema;
