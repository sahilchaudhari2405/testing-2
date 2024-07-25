import Product from "../model/product.model.js";
import OfflinePurchaseOrder from "../model/purchaseOrder.js";

export const generateOrderWithProductCheck = async (req, res) => {
    try {
        const { products, orderDetails } = req.body;
        const { id } = req.user;

        const orderItems = [];

        for (const productData of products) {
            let existingProduct = await Product.findOne({ BarCode: productData.BarCode });

            if (existingProduct) {
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
                const newProduct = new Product({
                    title: productData.title,
                    description: productData.description,
                    price: productData.price,
                    discountedPrice: productData.discountedPrice,
                    discountPercent: productData.discountPercent,
                    weight: productData.weight,
                    quantity: productData.quantity,
                    brand: productData.brand,
                    imageUrl: productData.imageUrl,
                    slug: productData.slug,
                    ratings: productData.ratings,
                    reviews: productData.reviews,
                    numRatings: productData.numRatings,
                    category: productData.category,
                    createdAt: productData.createdAt,
                    updatedAt: productData.updatedAt,
                    BarCode: productData.BarCode,
                    stockType: productData.stockType,
                    unit: productData.unit,
                    purchaseRate: productData.purchaseRate,
                    profitPercentage: productData.profitPercentage,
                    HSN: productData.HSN,
                    GST: productData.GST,
                    retailPrice: productData.retailPrice,
                    totalAmount: productData.totalAmount,
                    amountPaid: productData.amountPaid
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

        let totalPrice = 0;
        let totalPurchaseRate = 0;
        let totalGST = 0;
        let totalItem = 0;

        for (const item of orderItems) {
            totalPrice += item.retailPrice * item.quantity;
            totalPurchaseRate += item.purchaseRate * item.quantity;
            totalGST += (item.retailPrice * item.GST / 100) * item.quantity;
            totalItem += 1;
        }

        const newOrder = new OfflinePurchaseOrder({
            user: id,
            Name: orderDetails.Name,
            mobileNumber: orderDetails.mobileNumber,
            email: orderDetails.email,
            Address: {
                streetAddress: orderDetails.Address.streetAddress,
                area: orderDetails.Address.area,
                houseNumber: orderDetails.Address.houseNumber,
                landMark: orderDetails.Address.landMark,
                city: orderDetails.Address.city,
                district: orderDetails.Address.district,
                state: orderDetails.Address.state,
                zipCode: orderDetails.Address.zipCode
            },
            paymentType: orderDetails.paymentType,
            billImageURL: orderDetails.billImageURL,
            discount: orderDetails.discount,
            orderStatus: orderDetails.orderStatus,
            orderItems,
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
