import Product from "../model/product.model.js";
import OfflinePurchaseOrder from "../model/purchaseOrder.js";

export const generateOrderWithProductCheck = async (req, res) => {
    console.log(req.body);

    // Handle early response scenario
    if (!req.body || !req.body.products || !req.body.orderDetails) {
        return res.status(400).json({ message: "Invalid input", error: "Missing products or orderDetails" });
    }

    try {
        const { products, orderDetails } = req.body;
        const { id } = req.user;

        if (!id) {
            return res.status(400).json({ message: "User ID is missing in the request" });
        }

        const orderItems = [];

        for (const productData of products) {
            if (!productData.barcode) {
                return res.status(400).json({ message: "Product barcode is missing" });
            }

            let existingProduct = await Product.findOne({ BarCode: productData.barcode });

            if (existingProduct) {
                // Update the existing product
                existingProduct.quantity = (existingProduct.quantity || 0) + (parseInt(productData.qty, 10) || 0);
                existingProduct.purchaseRate = parseFloat(productData.purchaseRate) || 0;
                existingProduct.retailPrice = parseFloat(productData.saleRate) || 0;
                existingProduct.GST = parseFloat(productData.gst) || 0;

                await existingProduct.save();
                orderItems.push({
                    productId: existingProduct._id,
                    quantity: existingProduct.quantity,
                    purchaseRate: existingProduct.purchaseRate,
                    GST: existingProduct.GST,
                    retailPrice: existingProduct.retailPrice,
                    AmountPaid: parseFloat(productData.amountpaid) || 0,
                });
            } else {
                const newProduct = new Product({
                    title: productData.title || null,
                    description: productData.description || null,
                    price: parseFloat(productData.saleRate) || 0,
                    discountedPrice: parseFloat(productData.discountedPrice) || 0,
                    discountPercent: parseFloat(productData.discountPercent) || 0,
                    weight: parseFloat(productData.weight) || 0,
                    quantity: parseInt(productData.qty, 10) || 0,
                    brand: productData.brand || null,
                    imageUrl: productData.imageUrl || null,
                    slug: productData.slug || 'default-slug',
                    ratings: productData.ratings || [],
                    reviews: productData.reviews || [],
                    numRatings: parseInt(productData.numRatings, 10) || 0,
                    category: productData.category,
                    createdAt: productData.createdAt || null,
                    updatedAt: productData.updatedAt || null,
                    BarCode: productData.barcode || null,
                    stockType: productData.stockType || null,
                    unit: productData.unit || null,
                    purchaseRate: parseFloat(productData.purchaseRate) || 0,
                    profitPercentage: parseFloat(productData.profit) || 0,
                    HSN: productData.hsn || null,
                    GST: parseFloat(productData.gst) || 0,
                    retailPrice: parseFloat(productData.saleRate) || 0,
                    totalAmount: parseFloat(productData.total) || 0,
                    amountPaid: parseFloat(productData.amountpaid) || 0
                });

                await newProduct.save();
                orderItems.push({
                    productId: newProduct._id,
                    quantity: newProduct.quantity,
                    purchaseRate: newProduct.purchaseRate,
                    GST: newProduct.GST,
                    retailPrice: newProduct.retailPrice,
                    AmountPaid: newProduct.amountPaid,
                });
            }
        }

        let totalPrice = 0;
        let totalPurchaseRate = 0;
        let totalGST = 0;
        let totalItem = 0;

        for (const item of orderItems) {
            totalPrice += item.retailPrice * item.quantity;
            totalPurchaseRate += item.purchaseRate * item.quantity;
            totalGST += item.GST * item.quantity;
            totalItem += 1;
        }

        const newOrder = new OfflinePurchaseOrder({
            user: id,
            Name: orderDetails.name || 'Unknown',
            GSTNB: orderDetails.GSTNo || 'Not Provided',
            mobileNumber: orderDetails.mobileNumber || 'Not Provided',
            email: orderDetails.email || 'No',
            Address: `${orderDetails.address || 'No Address'} ${orderDetails.state || ''}`,
            paymentType: orderDetails.paymentType || { cash: 0, Card: 0, UPI: 0 },
            billImageURL: orderDetails.billImageURL || null,
            discount: orderDetails.discount || 0,
            orderStatus: orderDetails.orderStatus || 'first time',
            orderItems,
            totalPrice,
            totalPurchaseRate,
            GST: totalGST,
            totalItem,
            AmountPaid: orderDetails.AmountPaid || 0,
            orderDate: new Date(),
            createdAt: new Date(),
        });

        await newOrder.save();
        const results = await OfflinePurchaseOrder.findById(newOrder._id).populate({
            path: 'orderItems.productId',
            model: 'products'
        });
        res.status(201).json({ message: "Order created successfully", order: results });
    } catch (error) {
        console.error("Error creating order:", error); // Added logging for debugging
        res.status(500).json({ message: "Failed to create order", error: error.message });
    }
};
export const GetPurchaseOrder = async (req, res) => {
    const {id ,role} =req.user;
    if(role==='admin')
    {
        const results = await OfflinePurchaseOrder.find().populate({
            path: 'orderItems.productId',
            model: 'products'
        });
        res.status(201).json({ message: "Order created successfully", order: results });
    }
    else{
        const results = await OfflinePurchaseOrder.findOne({user:id}).populate({
            path: 'orderItems.productId',
            model: 'products'
        });
        res.status(201).json({ message: "Order created successfully", order: results });
    }
};