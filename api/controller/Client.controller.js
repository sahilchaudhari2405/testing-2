import { Client, ClientPurchase, ClosingBalance } from "../model/Client.model.js";

const createClient = async (req) => {
  try {
    const { Type, Name, Address, State, Mobile, Purchase, Closing } = req.body;
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

    // Check if the client already exists
    const existingClient = await Client.findOne({ Type, Name, Mobile });
    if (existingClient) {
      return await updateClient(req);
    }

    // Create ClosingBalance and ClientPurchase records
    const closingMonth = await ClosingBalance.create({
      monthYear: currentMonth,
      balance: Closing,
    });

    const purchaseMonth = await ClientPurchase.create({
      monthYear: currentMonth,
      Purchase: Purchase || 0,
    });

    // Create and save a new client
    const newClient = new Client({
      Type,
      Name,
      Address,
      State,
      Mobile,
      ClosingBalance: [closingMonth._id],
      CompletePurchase: [purchaseMonth._id],
      totalClosingBalance: Closing,
      totalCompletePurchase: Purchase || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await newClient.save();
    return newClient;
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};


// Update Client Controller
const updateClient = async (req) => {
  try {
    const { Type, Name, Mobile, Address, State, Purchase, Closing } = req.body;
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

    const existingClient = await Client.findOne({ Type, Name, Mobile });
    if (!existingClient) {
      return 'Client not found';
    }

    // Update ClosingBalance
    const lastClosingBalanceId = existingClient.ClosingBalance?.[existingClient.ClosingBalance.length - 1];
    let closingBalanceLast;
    if (lastClosingBalanceId) {
      closingBalanceLast = await ClosingBalance.findById(lastClosingBalanceId);
      if (closingBalanceLast?.monthYear === currentMonth) {
        closingBalanceLast.balance += Closing;
      } else {
        closingBalanceLast = await ClosingBalance.create({
          monthYear: currentMonth,
          balance: Closing,
        });
        existingClient.ClosingBalance.push(closingBalanceLast._id);
      }
    } else {
      closingBalanceLast = await ClosingBalance.create({
        monthYear: currentMonth,
        balance: Closing,
      });
      existingClient.ClosingBalance.push(closingBalanceLast._id);
    }
    await closingBalanceLast.save();

    // Update ClientPurchase
    const lastClientPurchaseId = existingClient.CompletePurchase?.[existingClient.CompletePurchase.length - 1];
    let clientPurchaseLast;
    if (lastClientPurchaseId) {
      clientPurchaseLast = await ClientPurchase.findById(lastClientPurchaseId);
      if (clientPurchaseLast?.monthYear === currentMonth) {
        clientPurchaseLast.Purchase += Purchase;
      } else {
        clientPurchaseLast = await ClientPurchase.create({
          monthYear: currentMonth,
          Purchase: Purchase,
        });
        existingClient.CompletePurchase.push(clientPurchaseLast._id);
      }
    } else {
      clientPurchaseLast = await ClientPurchase.create({
        monthYear: currentMonth,
        Purchase: Purchase,
      });
      existingClient.CompletePurchase.push(clientPurchaseLast._id);
    }
    await clientPurchaseLast.save();

    // Update client details
    existingClient.Address = Address;
    existingClient.State = State;
    existingClient.totalCompletePurchase += Purchase;
    existingClient.totalClosingBalance += Closing;
    existingClient.updatedAt = new Date();

    await existingClient.save();
    return existingClient;
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};

const reduceClient = async (data) => {
  try {
    const orderDate = new Date();
    const currentMonth = orderDate.toISOString().slice(0, 7); // YYYY-MM

    // Find the client using the data provided
    const updatedClient = await Client.findOne({
      Type: data.Type,
      Name: data.Name,
      Mobile: data.Mobile,
    });
    if (!updatedClient) {
      throw new Error('Client not found');
    }
    console.log(updatedClient);

    // Safely access the latest closing balance record
    const closingBalanceLastId = updatedClient.ClosingBalance?.[updatedClient.ClosingBalance.length - 1];
    let closingBalanceLast = closingBalanceLastId
      ? await ClosingBalance.findById(closingBalanceLastId)
      : null;
    if (!closingBalanceLast) {
      throw new Error('Closing balance record not found');
    }

    // Adjust the closing balance for the current month
    if (closingBalanceLast.monthYear === currentMonth) {
      closingBalanceLast.balance -= data.Closing;
      closingBalanceLast.balance = Math.max(0, closingBalanceLast.balance); // Ensure balance doesn't go negative
      await closingBalanceLast.save();
    }

    // Safely access the latest client purchase record
    const clientPurchaseLastId = updatedClient.CompletePurchase?.[updatedClient.CompletePurchase.length - 1];
    let clientPurchaseLast = clientPurchaseLastId
      ? await ClientPurchase.findById(clientPurchaseLastId)
      : null;
    if (!clientPurchaseLast) {
      throw new Error('Client purchase record not found');
    }

    // Adjust the purchase amount for the current month
    if (clientPurchaseLast.monthYear === currentMonth) {
      clientPurchaseLast.Purchase -= data.Purchase;
      clientPurchaseLast.Purchase = Math.max(0, clientPurchaseLast.Purchase); // Ensure purchase doesn't go negative
      await clientPurchaseLast.save();
    }

    // Update the client's overall records
    updatedClient.totalCompletePurchase = Math.max(0, updatedClient.totalCompletePurchase - data.Purchase);
    updatedClient.totalClosingBalance = Math.max(0, updatedClient.totalClosingBalance - data.Closing);
    updatedClient.updatedAt = new Date();

    await updatedClient.save();

    return updatedClient; // Return the updated client for further use if needed
  } catch (error) {
    console.error(error.message);
    throw new Error(error.message); // Throw the error to be handled by the calling function
  }
};


const getAllClients = async (req, res) => {
  try {
    const clients = await Client.find().sort({updatedAt: -1 }) 
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
      let matchCriteria = {};

      // Build the match criteria based on the provided alphabet (Name prefix)
      if (alphabet) {
          matchCriteria.Name = { $regex: `^${alphabet}`, $options: 'i' }; // Match Name starting with the alphabet
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
                  mobileNumberStr: number ? { $regex: `${number}` } : { $exists: true }, // Match Mobile containing the digit
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
export { updateClient, createClient ,reduceClient, getAllClients,searchClients};
 