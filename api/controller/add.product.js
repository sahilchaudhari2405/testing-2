// controllers/orderController.js
import Product from "../model/product.model";
import OfflinePurchaseOrder from "../model/purchaseOrder";

export const generateOrderWithProductCheck = async (req, res) => {
    try {
        const { products, orderDetails } = req.body;
        const { id } = req.user;
        // Array to store product details for the order
        const orderItems = [];

        for (const productData of products) {
            // Check if the product exists based on BarCode
            let existingProduct = await Product.findOne({ BarCode: productData.BarCode });

            if (existingProduct) {
                // Update the existing product
                existingProduct.quantity += productData.quantity;
                existingProduct.purchaseRate = productData.purchaseRate;
                existingProduct.retailPrice = productData.retailPrice;
                existingProduct.GST = productData.GST;

                await existingProduct.save();
                orderItems.push({
                    productId: existingProduct._id,
                    quantity: productData.quantity,
                    purchaseRate: productData.purchaseRate,
                    GST: productData.GST,
                    retailPrice: productData.retailPrice,
                });
            } else {
                // Create a new product
                const newProduct = new Product({
                    ...productData,
                });
                await newProduct.save();
                orderItems.push({
                    productId: newProduct._id,
                    quantity: productData.quantity,
                    purchaseRate: productData.purchaseRate,
                    GST: productData.GST,
                    retailPrice: productData.retailPrice,
                });
            }
        }

        // Calculate order totals
        let totalPrice = 0;
        let totalPurchaseRate = 0;
        let totalGST = 0;
        let totalItem = 0;

        for (const item of orderItems) {
            totalPrice += item.retailPrice * item.quantity;
            totalPurchaseRate += item.purchaseRate * item.quantity;
            totalGST += (item.retailPrice * item.GST / 100) * item.quantity; // GST calculation
            totalItem += 1;
        }

        // Create a new order
        const newOrder = new OfflinePurchaseOrder({
            user:id,
            ...orderDetails,
            orderItems, // Store only product IDs in orderItems
            totalPrice,
            totalPurchaseRate,
            GST: totalGST,
            totalItem,
            orderDate: new Date(),
            createdAt: new Date(),
        });

        await newOrder.save();

        res.status(201).json({ message: "Order created successfully", order: newOrder });
    } catch (error) {
        res.status(500).json({ message: "Failed to create order", error: error.message });
    }
};
