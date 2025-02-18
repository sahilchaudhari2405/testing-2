import { ClientPurchaseSchema, clientSchema, ClosingBalanceSchema } from "../model/Client.model.js";
import { getTenantModel } from "../database/getTenantModel.js";


const createClient = async (req) => {
  try {
    const { Type, Name, Address, State, Mobile, Purchase,Email,BankDetails,SHIPTO,Pin, Closing,tenantId,loyalty } = req.body;
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const Client = await getTenantModel(tenantId, "Client", clientSchema);
    const ClosingBalance = await getTenantModel(tenantId, "ClosingBalance", ClosingBalanceSchema);
    const ClientPurchase = await getTenantModel(tenantId, "ClientPurchase", ClientPurchaseSchema);
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
      loyalty,
      Email,
      Pin:Pin,
      BankDetails:BankDetails,
      SHIPTO:SHIPTO,
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
    const { Type, Name, Mobile, Address,Email, State,BankDetails,SHIPTO,Pin, Purchase, Closing,tenantId,loyalty } = req.body;
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const Client = await getTenantModel(tenantId, "Client", clientSchema);
    const ClosingBalance = await getTenantModel(tenantId, "ClosingBalance", ClosingBalanceSchema);
    const ClientPurchase = await getTenantModel(tenantId, "ClientPurchase", ClientPurchaseSchema);
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
console.log(loyalty);
    // Update client details
    existingClient.Pin=Pin,
    existingClient.BankDetails=BankDetails,
    existingClient.SHIPTO=SHIPTO,
    existingClient.Address = Address;
    existingClient.Email =Email;
    existingClient.State = State;
    existingClient.totalCompletePurchase += Purchase;
    existingClient.loyalty +=loyalty;
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
    const tenantId= data.tenantId;
    const Client = await getTenantModel(tenantId, "Client", clientSchema);
    const ClosingBalance = await getTenantModel(tenantId, "ClosingBalance", ClosingBalanceSchema);
    const ClientPurchase = await getTenantModel(tenantId, "ClientPurchase", ClientPurchaseSchema);
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



export { updateClient, createClient ,reduceClient};
 