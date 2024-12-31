import { getTenantModel } from "../database/getTenantModel.js";
import { ClientPurchaseSchema, clientSchema, ClosingBalanceSchema } from "../model/Client.model.js";


const getAllClients = async (req, res) => {
 // Get the page number from query, default to 1
  const limit =500; // Get the limit from query, default to 20 // Calculate how many products to skip
  try {
    const tenantId = req.user.tenantId;
    const Client = await getTenantModel(tenantId, "Client", clientSchema);
    const ClosingBalance = await getTenantModel(tenantId, "ClosingBalance", ClosingBalanceSchema);
    const ClientPurchase = await getTenantModel(tenantId, "ClientPurchase", ClientPurchaseSchema);
    const clients = await Client.find().sort({updatedAt: -1 }) 
      .limit(limit)
      .populate('ClosingBalance')
      .populate('CompletePurchase');

    // Respond with the retrieved clients
    res.status(200).json(clients);
  } catch (error) {
    console.error('Failed to retrieve clients:', error);
    res.status(500).json({ message: 'Failed to retrieve clients', error: error.message });
  }
};

const searchClients = async (req, res) => {
  const { alphabet, number } = req.body; // Get the alphabet (name prefix) and mobile number from the request body

  try {
    let matchCriteria = { Type: 'Client'};
    const tenantId = req.user.tenantId;
    const Client = await getTenantModel(tenantId, "Client", clientSchema);
    const ClosingBalance = await getTenantModel(tenantId, "ClosingBalance", ClosingBalanceSchema);
    const ClientPurchase = await getTenantModel(tenantId, "ClientPurchase", ClientPurchaseSchema);
    // Build the match criteria based on the provided alphabet (Name prefix)
    if (alphabet) {
      matchCriteria.Name = { $regex: `^${alphabet}`, $options: 'i' }; // Match Name exactly starting with the alphabet
    }

    // Aggregate pipeline to match and group the records
    const distinctClients = await Client.aggregate([
      {
        $addFields: {
          mobileNumberStr: { $toString: "$Mobile" }, // Convert Mobile to string
        },
      },
      {
        $match: {
          ...matchCriteria,
          mobileNumberStr: number ? { $regex: `^${number}` } : { $exists: true }, // Match Mobile containing the digit
        },
      },
      {
        $group: {
          _id: "$_id", // Group by Mobile to ensure distinct entries
          Name: { $first: "$Name" },
          Mobile: { $first: "$Mobile" },
          Email: { $first: "$Email" },
          Address: { $first: "$Address" },
          State: { $first: "$State" },
        },
      },
    ]);

    return res.status(200).send({
      message: "Distinct clients retrieved successfully",
      status: true,
      data: distinctClients,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Internal server error",
      status: false,
      error: error.message,
    });
  }
};
const searchClientsDistributer = async (req, res) => {
  const { alphabet, number } = req.body; // Get the alphabet (name prefix) and mobile number from the request body


  try {
    const tenantId = req.user.tenantId;
    const Client = await getTenantModel(tenantId, "Client", clientSchema);
    const ClosingBalance = await getTenantModel(tenantId, "ClosingBalance", ClosingBalanceSchema);
    const ClientPurchase = await getTenantModel(tenantId, "ClientPurchase", ClientPurchaseSchema);
    let matchCriteria = { Type: 'Supplier'};

    // Build the match criteria based on the provided alphabet (Name prefix)
    if (alphabet) {
      matchCriteria.Name = { $regex: `^${alphabet}`, $options: 'i' }; // Match Name exactly starting with the alphabet
    }

    // Aggregate pipeline to match and group the records
    const distinctClients = await Client.aggregate([
      {
        $addFields: {
          mobileNumberStr: { $toString: "$Mobile" }, // Convert Mobile to string
        },
      },
      {
        $match: {
          ...matchCriteria,
          mobileNumberStr: number ? { $regex: `^${number}` } : { $exists: true }, // Match Mobile containing the digit
        },
      },
      {
        $group: {
          _id: "$Mobile", // Group by Mobile to ensure distinct entries
          Name: { $first: "$Name" },
          Mobile: { $first: "$Mobile" },
          Email: { $first: "$Email" },
          Address: { $first: "$Address" },
          State: { $first: "$State" },
        },
      },
    ]);

    return res.status(200).send({
      message: "Distinct clients retrieved successfully",
      status: true,
      data: distinctClients,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Internal server error",
      status: false,
      error: error.message,
    });
  }
};




const getAllCustomer = async (req, res) => {

  console.log("page:",req.query)
  const page = parseInt(req.query.page) || 1; // Get the page number from query, default to 1
  const limit = parseInt(req.query.limit) ||20; // Get the limit from query, default to 20
  const skip = (page - 1) * limit; // Calculate how many products to skip
  try {
    const tenantId = req.user.tenantId;
    const Client = await getTenantModel(tenantId, "Client", clientSchema);
    const ClosingBalance = await getTenantModel(tenantId, "ClosingBalance", ClosingBalanceSchema);
    const ClientPurchase = await getTenantModel(tenantId, "ClientPurchase", ClientPurchaseSchema);
    const clients = await Client.find().sort({updatedAt: -1 }) 
      .skip(skip)
      .limit(limit)
      .populate('ClosingBalance')
      .populate('CompletePurchase');
    // Respond with the retrieved clients
    res.status(200).json(clients);
  } catch (error) {
    console.error('Failed to retrieve clients:', error);
    res.status(500).json({ message: 'Failed to retrieve clients', error: error.message });
  }
};



const searchCustomer = async (req, res) => {
  const { alphabet, number } = req.body;

  // Initialize an empty query object
  let query = {};

  // Add conditions to the query object if fields are provided
  if (alphabet) {
    query.Name = { $regex: `^${alphabet}`, $options: 'i' }; // Case-insensitive regex for names starting with alphabet
  }

  if (number) {
    query.Mobile = number; // Exact match for mobile number
  }

  try {
    // Find clients based on the constructed query
    const tenantId = req.user.tenantId;
    const Client = await getTenantModel(tenantId, "Client", clientSchema);
    const ClosingBalance = await getTenantModel(tenantId, "ClosingBalance", ClosingBalanceSchema);
    const ClientPurchase = await getTenantModel(tenantId, "ClientPurchase", ClientPurchaseSchema);
    const clients = await Client.find(query)
      .sort({ updatedAt: -1 }) // Sort by updatedAt in descending order
      .populate('ClosingBalance')
      .populate('CompletePurchase');

    // Respond with the retrieved clients
    res.status(200).json(clients);
  } catch (error) {
    console.error('Failed to retrieve clients:', error);
    res.status(500).json({ message: 'Failed to retrieve clients', error: error.message });
  }
};




export { getAllClients,searchCustomer,searchClientsDistributer,getAllCustomer,searchClients};
 