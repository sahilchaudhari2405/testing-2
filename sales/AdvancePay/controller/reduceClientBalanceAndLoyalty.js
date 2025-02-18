import { getTenantModel } from "../database/getTenantModel.js";
import { ClientPurchaseSchema, clientSchema, ClosingBalanceSchema } from "../model/Client.model.js";

const reduceClientBalanceAndLoyalty = async (req, res) => {
  try {
    const { clientId, amount, loyaltyReduction } = req.body;
    console.log(req.body)
    const tenantId =req.user.tenantId
    const Client = await getTenantModel(tenantId, "Client", clientSchema);
    const ClosingBalance = await getTenantModel(tenantId, "ClosingBalance", ClosingBalanceSchema);
    const ClientPurchase = await getTenantModel(tenantId, "ClientPurchase", ClientPurchaseSchema);
    const client = await Client.findById(clientId);

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    if (client.totalClosingBalance < amount) {
      return res.status(400).json({ message: 'Insufficient closing balance' });
    }

    if (client.loyalty < loyaltyReduction) {
      return res.status(400).json({ message: 'Insufficient loyalty points' });
    }

    // Reduce closing balance and loyalty
    client.totalClosingBalance -= amount || 0;
    client.loyalty -= loyaltyReduction || 0;

    // Save the updated client data
    await client.save();

    res.status(200).json({ message: 'Balance and loyalty reduced successfully', client });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export { reduceClientBalanceAndLoyalty };
