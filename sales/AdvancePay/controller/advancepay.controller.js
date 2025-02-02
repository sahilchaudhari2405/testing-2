import { getTenantModel } from "../database/getTenantModel.js";
import AdvancePaySchema from "../model/advancePay.js";
import Offline_cartSchema from "../model/cart.model.js";
import Offline_cartItemSchema from "../model/cartItem.model.js";
import { clientSchema } from "../model/Client.model.js";
import productSchema from "../model/product.model.js";
import CounterUserSchema from "../model/user.model.js";
// Add a new advance payment entry to the advancePay array or create the document
const addOrCreateAdvancePaymentEntry = async (req, res) => {
    try {
      const { clientId, cart, amount, date, time, AdvancePaidId } = req.body; // Data for advance payment
      const tenantId = req.user.tenantId; // Get tenantId from user info
      console.log(req.body);
  
      // Get models for the tenant
      const Offline_Cart = await getTenantModel(tenantId, "Offline_Cart", Offline_cartSchema);
      const Offline_CartItem = await getTenantModel(tenantId, "Offline_CartItem", Offline_cartItemSchema);
      const AdvancePay = await getTenantModel(tenantId, "AdvancePay", AdvancePaySchema);
  
      // Find the document by ID (if it exists)
      let advancePayment;
  
      if (!AdvancePaidId) {
        // If the document doesn't exist, create a new one
        advancePayment = new AdvancePay({
          clientId,
          cart,
          advancePay: [{ amount, date, time }],
        });
  
        // Save the advance payment document
        await advancePayment.save();
  
        // Update the Offline Cart with the PayId
     const data =   await Offline_Cart.findByIdAndUpdate(cart, {
          PayId: advancePayment._id,
        });
  
        // Loop through the cart items and update each with the PayId
        for (let item of data.cartItems) {
          await Offline_CartItem.findByIdAndUpdate(item._id, {
            PayId: advancePayment._id,
          });
        }
  
        return res.status(201).json({
          message: "Advance payment created successfully",
          advancePayment,
        });
      }
  
      // If the document exists, add the new entry to the advancePay array
      advancePayment = await AdvancePay.findByIdAndUpdate(
        AdvancePaidId,
        { $push: { advancePay: { amount, date, time } } },
        { new: true }
      );
  
      return res.status(200).json({
        message: "Advance payment entry added successfully",
        advancePayment,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Error adding or creating advance payment entry",
        error,
      });
    }
  };
  

// Delete an entry from the advancePay array
const deleteAdvancePaymentEntry = async (req, res) => {
    try {
        const { id } = req.params; // ID of the AdvancePay document
        const { entryId } = req.body; // ID of the entry to remove from advancePay array
        const tenantId =req.user.tenantId
        const AdvancePay = await getTenantModel(tenantId, "AdvancePay", AdvancePaySchema);
        const updatedPayment = await AdvancePay.findByIdAndUpdate(
            id,
            { $pull: { advancePay: { _id: entryId } } }, // Remove entry by its _id
            { new: true }
        );

        if (!updatedPayment) {
            return res.status(404).json({ message: "Advance payment not found" });
        }

        res.status(200).json({ message: "Advance payment entry deleted successfully", updatedPayment });
    } catch (error) {
        res.status(500).json({ message: "Error deleting advance payment entry", error });
    }
};

// Mark an advance payment as complete
const completeAdvancePayment = async (req, res) => {
    try {
        const { AdvancePaidId,
            orderId,} = req.query;
        const tenantId =req.user.tenantId
        const AdvancePay = await getTenantModel(tenantId, "AdvancePay", AdvancePaySchema);
        const updatedPayment = await AdvancePay.findByIdAndUpdate(
            id,
            { status: 'complete',cart:orderId },
            { new: true }
        );

        if (!updatedPayment) {
            return res.status(404).json({ message: "Advance payment not found" });
        }

        res.status(200).json({ message: "Advance payment marked as complete", updatedPayment });
    } catch (error) {
        res.status(500).json({ message: "Error updating advance payment status", error });
    }
};

// Get AdvancePay document by ID and populate the cart field


// Get AdvancePay with nested population of client, cart, and cart items
const getAdvancePaymentWithDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const tenantId = req.user.tenantId;

        const AdvancePay = await getTenantModel(tenantId, "AdvancePay", AdvancePaySchema);
        const Offline_Cart = await getTenantModel(tenantId, "Offline_Cart", Offline_cartSchema);
        const Product = await getTenantModel(tenantId, "Product", productSchema);
        const Offline_CartItem = await getTenantModel(tenantId, "Offline_CartItem", Offline_cartItemSchema);
        const CounterUser = await getTenantModel(tenantId, "CounterUser", CounterUserSchema);
        const Client = await getTenantModel(tenantId, "Client", clientSchema);

        // Find AdvancePay by ID, populate clientId, cart, and cartId inside cart
        const advancePayment = await AdvancePay.findOne({ clientId: id,status:"pending"}) // Find by clientId
        .populate("clientId") // Populate the clientId field
        .populate({
            path: "cart", // Populate the cart field in AdvancePay
            populate: {
                path: "cartItems", // Populate cartItems inside the cart
                model: "Offline_CartItem",
                populate: {
                    path: "product", // Populate product inside each cart item
                    model: "Product",
                },
            },
        });

        if (!advancePayment) {
            return res.status(404).json({ message: "Advance payment not found" });
        }

        res.status(200).json({
            message: "Advance payment retrieved successfully",
            advancePayment,
        });
    } catch (error) {
        console.error("Error retrieving advance payment:", error);
        res.status(500).json({ message: "Error retrieving advance payment", error });
    }
};


export {
    addOrCreateAdvancePaymentEntry,
    deleteAdvancePaymentEntry,
    completeAdvancePayment,
    getAdvancePaymentWithDetails
}