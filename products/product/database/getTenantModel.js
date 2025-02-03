import mongoose from "mongoose";


// Cache for database connections to prevent creating a new connection every time
const cachedConnections = {};

const connectToTenantDb = async (tenantId) => {
    const dbName = tenantId; // Construct a database name for the tenant
    const uri = `${process.env.DATABASE_URL_SWITCH}/${dbName}?retryWrites=true&w=majority&appName=Cluster0`;
  // MongoDB URI with tenant-specific database

    // If connection for this tenant already exists, return it from the cache
    if (cachedConnections[dbName]) {
        return cachedConnections[dbName];
    }

    try {
        // Create a new connection for the tenant
        const connection = await mongoose.createConnection(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 5,  // Adjust connection pool size as necessary
        });
        

        // Cache the connection
        cachedConnections[dbName] = connection;
        console.log(`Connected to tenant database: ${dbName}`);
        return connection;
    } catch (error) {
        console.error(`Error connecting to database ${dbName}:`, error);
        throw new Error('Database connection failed');
    }
};

/**
 * Dynamically creates or retrieves a Mongoose model for a tenant-specific collection.
 * @param {String} tenantId - The unique identifier for the tenant.
 * @param {String} modelName - The base name of the model.
 * @param {mongoose.Schema} schema - The schema to use for the model.
 * @returns {mongoose.Model} - The dynamically generated model for the tenant's collection.
 */
const getTenantModel = async (tenantId, modelName, schema) => {
    // Ensure the database connection is established before creating the model
    const connection = await connectToTenantDb(tenantId);

    // Check if the model already exists for the current tenant's connection
    if (connection.models[modelName]) {
        return connection.models[modelName];
    }

    // Create and return the model if it doesn't exist
    return connection.model(modelName, schema);
};

export { connectToTenantDb, getTenantModel };
