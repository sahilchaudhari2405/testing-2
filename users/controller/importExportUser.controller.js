import { getTenantModel } from "../database/getTenantModel.js";
import { ClientPurchaseSchema, clientSchema, ClosingBalanceSchema } from "../model/Client.model.js";

function MobileDigite(v) {
  return /\d{10}/.test(v); // Validates a 10-digit mobile number
}

export const importUser = async (req, res) => {
  const { users } = req.body;

  const importResults = {
    success: [],
    skipped: [],
    failed: [],
  };

  try {
    const tenantId = req.user.tenantId;
    const Client = await getTenantModel(tenantId, "Client", clientSchema);
    const ClosingBalance = await getTenantModel(tenantId, "ClosingBalance", ClosingBalanceSchema);
    const ClientPurchase = await getTenantModel(tenantId, "ClientPurchase", ClientPurchaseSchema);

    for (const data of users) {
      try {
        const { Type, Name, Address, State, Mobile, 'Closing Balance': ClosingBalanceValue } = data;
         console.log(Name)
        // Validate input
        if (!Type || !Name || !Mobile || !/^\d{10}$/.test(Mobile)) {
          importResults.skipped.push({ data, reason: 'Missing or invalid fields' });
          continue;
        }

        // Check for existing client
        const existingUser = await Client.findOne({ Type, Name, Mobile });
        if (existingUser) {
          importResults.skipped.push({ data, reason: 'Client already exists' });
          continue;
        }

        const currentMonth = new Date().toISOString().slice(0, 7);

        // Create ClosingBalance and ClientPurchase entries
        const closingMonth = await ClosingBalance.create({
          monthYear: currentMonth,
          balance: ClosingBalanceValue || 0,
        });

        const purchaseMonth = await ClientPurchase.create({
          monthYear: currentMonth,
          Purchase: 0,
        });

        // Create new Client
        const client = new Client({
          Type,
          Name,
          Address,
          State,
          Mobile,
          ClosingBalance: [closingMonth],
          CompletePurchase: [purchaseMonth],
          totalClosingBalance: ClosingBalanceValue || 0,
          totalCompletePurchase: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        await client.save();
        importResults.success.push({ data });
      } catch (innerError) {
        importResults.failed.push({ data, error: innerError.message });
      }
    }

    res.status(201).json({ message: 'Import process completed', results: importResults });
  } catch (error) {
    console.error('Import process failed:', error);
    res.status(500).json({ message: 'Failed to import users', error: error.message });
  }
};
