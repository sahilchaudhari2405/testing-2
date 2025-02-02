// Middleware to dynamically set collection based on tenant
const setTenantCollection = (req, res, next) => {
    const tenantId = req.headers['x-tenant-id'] ; // or get from subdomain or URL
    
    if (!tenantId) {
        return res.status(400).send('Tenant ID is required');
    }

    // Dynamically set the collection for the specific tenant
    req.dbCollection = mongoose.connection.db.collection(tenantId + '_collectionName');
    next();
};
export default setTenantCollection;