import Category from "../model/category.model.js";
import Product from "../model/product.model.js";
import OfflinePurchaseOrder from "../model/purchaseOrder.js";
import { createClient } from "./Client.controller.js";

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
            let imageUrl = '';

            if (!productData.barcode) {
                return res.status(400).json({ message: "Product barcode is missing" });
            }
           // console.log(productData)
            const category = await Category.findOne({name: productData.category});
            if(!category)
            {
                return res.status(400).json({ message: "category missing" });
            }
            let existingProduct = await Product.findOne({ BarCode: productData.barcode });
             
            if (existingProduct) {
                existingProduct.quantity = existingProduct.quantity + (parseInt(productData.qty, 10) || 0);
                existingProduct.purchaseRate = parseFloat(productData.purchaseRate,10) || 0;
                existingProduct.retailPrice = parseInt(productData.saleRate, 10)|| 0;
                existingProduct.GST = parseInt(productData.gst, 10) || 0;
                existingProduct.updatedAt = new Date();
                await existingProduct.save();
                
                orderItems.push({
                    productId: existingProduct._id,
                    quantity: productData.qty,
                    purchaseRate: existingProduct.purchaseRate,
                    GST: existingProduct.GST,
                    retailPrice: existingProduct.retailPrice,
                    AmountPaid: parseFloat(productData.amountpaid) || 0,
                });
            } else {
                const newProduct = new Product({
                    title: productData.description || null,
                    description: productData.description || null,
                    price: parseFloat(productData.MRP, 10) || 0,
                    discountedPrice: parseInt(productData.saleRate, 10) || 0,
                    discountPercent: parseFloat(productData.discountPercent, 10) || 0,
                    weight: parseInt(productData.weight, 10) || 0,
                    quantity: parseInt(productData.qty, 10) || 0,
                    brand: productData.brand || null,
                    imageUrl: productData.imageUrl || 'https://res.cloudinary.com/dc77zxyyk/image/upload/v1722436071/jodogeuuufbcrontd3ik.png',
                    slug: productData.slug || 'default-slug',
                    ratings: productData.ratings || [],
                    reviews: productData.reviews || [],
                    numRatings: parseInt(productData.numRatings, 10) || 0,
                    category: category._id,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    BarCode: productData.barcode || null,
                    stockType: productData.stockType || null,
                    unit: productData.unit || null,
                    purchaseRate: parseFloat(productData.purchaseRate,10) || 0,
                    profitPercentage: parseFloat(productData.profit,10) || 0,
                    HSN: productData.hsn || null,
                    GST: parseInt(productData.gst, 10) || 0,
                    retailPrice: parseInt(productData.saleRate, 10) || 0,
                    totalAmount: parseInt(productData.total, 10) || 0,
                    amountPaid: parseInt(productData.amountpaid, 10) || 0
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
        const Amount = orderDetails.paymentType.cash + orderDetails.paymentType.Card+orderDetails.paymentType.UPI ;
        const newOrder = new OfflinePurchaseOrder({
            user: id,
            Name: orderDetails.name || 'Unknown',
            GSTNB: orderDetails.GSTNo || 'Not Provided',  
            mobileNumber: orderDetails.mobileNumber || 'Not Provided',
            email: orderDetails.email || 'No',
            Address: `${orderDetails.address || 'No Address'} ${orderDetails.state || ''}`,
            paymentType: orderDetails.paymentType || { cash: 0, Card: 0, UPI: 0,borrow:0 },
            billImageURL: orderDetails.billImageURL || null,
            discount: orderDetails.discount || 0,
            orderStatus: orderDetails.orderStatus || 'first time',
            orderItems,
            totalPrice,
            totalPurchaseRate,
            GST: totalGST,
            totalItem,
            AmountPaid: parseInt(Amount,10)|| 0,
            orderDate: new Date(),
            createdAt: new Date(),
        });
        const clientReq = {
            body: {
                Type: 'Distributor',
                Name: orderDetails.name,
                Email: orderDetails.email || "",
                Address: orderDetails.address,
                State:  orderDetails.state,
                Mobile:  orderDetails.mobileNumber,
                Purchase:newOrder.AmountPaid+orderDetails.paymentType.borrow|| 0,
                Closing: orderDetails.paymentType.borrow || 0,
            }
        };
        const r = await createClient(clientReq);
        console.log(r);
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
        const results = await OfflinePurchaseOrder.find().populate('user').populate({
            path: 'orderItems.productId',
            model: 'products'
        });
        res.status(201).json({ message: "Order created successfully", order: results });
    }
    else{
        const results = await OfflinePurchaseOrder.find({user:id}).populate('user').populate({
            path: 'orderItems.productId',
            model: 'products'
        });
        res.status(201).json({ message: "Order created successfully", order: results });
    }
};