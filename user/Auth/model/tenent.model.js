import mongoose from 'mongoose';

const tenantUserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
    },
    mobile: {
        type: Number,
        required: true,  // Corrected `require` to `required`
        unique: true,
    },
    tenantId: {
        type: String,
        required: true,
    },
    softwarePlan: {
        type: Boolean,  // Ensure the field is of type Boolean
        required: true, // It should be required if you expect it to be present
        default: true,  // Correctly use default with the boolean value
    },
    expiryDate: {
        type: String, // expiryDate as a string (e.g., "2025-01-02")
        required: true,
      },
    
});

const TenantUser = mongoose.model('TenantUser', tenantUserSchema);

export default TenantUser;
