import AdvancePay from "../models/AdvancePay";
// Add a new advance payment entry to the advancePay array or create the document
const addOrCreateAdvancePaymentEntry = async (req, res) => {
    try {
        const { clientId, cart, amount, date, time } = req.body; // Data for advance payment
        const { id } = req.params; // ID of the AdvancePay document

        // Find the document by ID
        let advancePayment = await AdvancePay.findById(id);

        if (!advancePayment) {
            // If the document doesn't exist, create a new one
            advancePayment = new AdvancePay({
                clientId,
                cart,
                advancePay: [{ amount, date, time }]
            });

            await advancePayment.save();
            return res.status(201).json({ message: "Advance payment created successfully", advancePayment });
        }

        // If the document exists, add the new entry to the advancePay array
        advancePayment = await AdvancePay.findByIdAndUpdate(
            id,
            { $push: { advancePay: { amount, date, time } } },
            { new: true }
        );

        res.status(200).json({ message: "Advance payment entry added successfully", advancePayment });
    } catch (error) {
        res.status(500).json({ message: "Error adding or creating advance payment entry", error });
    }
};


// Delete an entry from the advancePay array
const deleteAdvancePaymentEntry = async (req, res) => {
    try {
        const { id } = req.params; // ID of the AdvancePay document
        const { entryId } = req.body; // ID of the entry to remove from advancePay array

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
        const { id } = req.params;

        const updatedPayment = await AdvancePay.findByIdAndUpdate(
            id,
            { status: 'complete' },
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

        // Find AdvancePay by ID, populate clientId, cart, and cartId inside cart
        const advancePayment = await AdvancePay.findById(id)
            .populate("clientId") // Populate clientId field
            .populate({
                path: "cart", // Populate cart field in AdvancePay
                populate: {
                    path: "cartId", // Populate cartId inside each cart document
                    model: "Offline_CartItem", // Ensure the model name matches your schema
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
        res.status(500).json({ message: "Error retrieving advance payment", error });
    }
};

export {
    addOrCreateAdvancePaymentEntry,
    deleteAdvancePaymentEntry,
    completeAdvancePayment,
    getAdvancePaymentWithDetails
}