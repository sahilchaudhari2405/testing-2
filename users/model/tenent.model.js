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
        unique:true,  // Ensure tenantId is required
    },
    softwarePlan: {
        type: Boolean,  // Ensure the field is of type Boolean
        required: true, // It should be required if you expect it to be present
        default: true,  // Correctly use default with the boolean value
    }
});

const TenantUser = mongoose.model('TenantUser', tenantUserSchema);

export default TenantUser;
