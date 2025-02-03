import { getTenantModel } from "../database/getTenantModel.js";
import categorySchema from "../model/category.model.js";
import productSchema from "../model/product.model.js";
import offlinePurchaseOrderSchema from "../model/purchaseOrder.js";
import OfflinePurchaseOrder from "../model/purchaseOrder.js";
import { createClient } from "./Client.controller.js";

async function CreateCategory(name, level, slug, parentId, CategoryModel) {
    const category = new CategoryModel({ name, level, slug, parentId });
    await category.save();
    return category;
}

export const generateOrderWithProductCheck = async (req, res) => {
    console.log(req.body);

    if (!req.body || !req.body.products || !req.body.orderDetails) {
        return res.status(400).json({ message: "Invalid input", error: "Missing products or orderDetails" });
    }

    try {
        const { products, orderDetails,Pin,BankDetails,SHIPTO } = req.body;
        const { id } = req.user;
        const tenantId = req.user.tenantId;
        const Product = await getTenantModel(tenantId, "Product", productSchema);
        const OfflinePurchaseOrder = await getTenantModel(tenantId, "OfflinePurchaseOrder", offlinePurchaseOrderSchema);
        const Category = await getTenantModel(tenantId, "Category", categorySchema);

        const parentCategory = await Category.findOne({ name: "GENERAL" });

        if (!id) {
            return res.status(400).json({ message: "User ID is missing in the request" });
        }

        // Prepare barcode array for batch fetch
        const productBarcodes = products.map(p => p.barcode);

        // Fetch all existing products in one query
        const existingProducts = await Product.find({ BarCode: { $in: productBarcodes } });

        // Create a product lookup for quick reference
        const existingProductMap = existingProducts.reduce((map, product) => {
            map[product.BarCode] = product;
            return map;
        }, {});

        // Prepare bulk operations for Products
        const bulkOperations = [];
        const orderItems = [];

        for (const productData of products) {
            const existingProduct = existingProductMap[productData.barcode];
            const quantity = parseInt(productData.qty, 10) || 0;
            const purchaseRate = parseFloat(productData.purchaseRate, 10) || 0;
            const retailPrice = parseInt(productData.saleRate, 10) || 0;
            const cgst = parseInt(productData.cgst, 10) || 0;
            const sgst = parseInt(productData.sgst, 10) || 0;
            if (existingProduct) {
                // Update existing product in bulk operation
                bulkOperations.push({
                    updateOne: {
                        filter: { BarCode: productData.barcode },
                        update: {
                            $inc: { quantity },
                            $set: { purchaseRate, retailPrice, GST: gst, updatedAt: new Date() }
                        }
                    }
                });

                // Push the updated product details to orderItems
                orderItems.push({
                    productId: existingProduct._id,
                    quantity,
                    purchaseRate,
                    SGST: sgst,
                    CGST: cgst,
                    retailPrice,
                    AmountPaid: parseFloat(productData.amountpaid) || 0,
                });
            } else {
                // Create a new product in bulk operation
                bulkOperations.push({
                    insertOne: {
                        document: {
                            title: productData.description || null,
                            description: productData.description || null,
                            price: parseFloat(productData.MRP, 10) || 0,
                            discountedPrice: retailPrice,
                            discountPercent: parseFloat(productData.discountPercent, 10) || 0,
                            weight: parseInt(productData.weight, 10) || 0,
                            quantity,
                            brand: productData.brand || null,
                            imageUrl: productData.imageUrl || 'default-image-url',
                            BarCode: productData.barcode,
                            category: parentCategory._id,
                            purchaseRate,
                            profitPercentage: parseFloat(productData.profit, 10) || 0,
                            SGST: sgst,
                            CGST: cgst,
                            retailPrice,
                            totalAmount: parseInt(productData.total, 10) || 0,
                            amountPaid: parseInt(productData.amountpaid, 10) || 0,
                            createdAt: new Date(),
                            updatedAt: new Date()
                        }
                    }
                });

                // Push the new product details to orderItems
                const productId = await Product.findOne({ BarCode: productData.barcode }).select('_id');
                orderItems.push({
                    productId,
                    quantity,
                    purchaseRate,
                    SGST: sgst,
                    CGST: cgst,
                    retailPrice,
                    AmountPaid: parseFloat(productData.amountpaid) || 0,
                });
            }
        }

        // Execute the bulkWrite operation for all products
        await Product.bulkWrite(bulkOperations);

        // Now update each orderItem with the correct productId
        for (let i = 0; i < orderItems.length; i++) {
            const productData = products[i];
            const productBarcode = productData.barcode;
            const orderItem = orderItems[i];

            // If the product exists in the database, it should already have an _id
            if (existingProductMap[productBarcode]) {
                orderItem.productId = existingProductMap[productBarcode]._id; // Set productId to the existing product _id
            } else {
                // If the product is newly created, find its _id
                const newProduct = await Product.findOne({ BarCode: productBarcode }).select('_id');

                if (newProduct) {
                    orderItem.productId = newProduct._id; // Set productId to the newly created product _id
                } else {
                    // Handle the case where the product could not be found (this shouldn't happen if everything works correctly)
                    console.error(`Product with barcode ${productBarcode} not found after bulkWrite`);
                }
            }
        }
console.log(orderItems)
        // Calculate total amounts for the order
        const totalPrice = orderItems.reduce((sum, item) => sum + item.retailPrice * item.quantity, 0);
        const totalPurchaseRate = orderItems.reduce((sum, item) => sum + item.purchaseRate * item.quantity, 0);
        const totalGST = orderItems.reduce((sum, item) => {
            const itemGST = (item.price * item.quantity * (item.CGST + item.SGST)) / 100;
            return sum + itemGST;
        }, 0);
        const totalItem = orderItems.length;

        const Amount = orderDetails.paymentType.cash + orderDetails.paymentType.Card + orderDetails.paymentType.UPI;

        // Create new order
        const newOrder = new OfflinePurchaseOrder({
            user: id,
            Name: orderDetails.name || 'Unknown',
            GSTNB: orderDetails.GSTNo || 'Not Provided',
            mobileNumber: orderDetails.mobileNumber || 'Not Provided',
            email: orderDetails.email || 'No',
            Address: `${orderDetails.address || 'No Address'} ${orderDetails.state || ''}`,
            paymentType: orderDetails.paymentType || { cash: 0, Card: 0, UPI: 0, borrow: 0 },
            billImageURL: orderDetails.billImageURL || null,
            discount: orderDetails.discount || 0,
            orderStatus: orderDetails.orderStatus || 'first time',
            orderItems, // Use updated orderItems with correct productId
            totalPrice,
            totalPurchaseRate,
            GST: totalGST,
            totalItem,
            AmountPaid: parseInt(Amount, 10) || 0,
            orderDate: new Date(),
            createdAt: new Date(),
        });

        const clientReq = {
            body: {
                Type: 'Supplier',
                Name: orderDetails.name,
                Email: orderDetails.email || "",
                Address: orderDetails.address,
                State: orderDetails.state,
                Mobile: orderDetails.mobileNumber,
                Pin:Pin,
                BankDetails:BankDetails,
                SHIPTO: SHIPTO,
                Purchase: newOrder.AmountPaid + orderDetails.paymentType.borrow || 0,
                Closing: orderDetails.paymentType.borrow || 0,
                tenantId: tenantId,
            }
        };

        const r = await createClient(clientReq);
        console.log(r);

        await newOrder.save();

        const results = await OfflinePurchaseOrder.findById(newOrder._id).populate({
            path: 'orderItems.productId',
            model: 'Product'
        });

        res.status(201).json({ message: "Order created successfully", order: results });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ message: "Failed to create order", error: error.message });
    }
};
