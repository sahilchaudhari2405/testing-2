import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Offline_Cart from "../model/cart.model.js";
import OfflineOrderItem from "../model/orderItems.js";
import Product from "../model/product.model.js";
import OfflineOrder from "../model/order.model.js";
import Offline_CartItem from "../model/cartItem.model.js";
import { handleOfflineCounterSales } from "./counter.sales.info.js";


const placeOrder = asyncHandler(async (req, res) => {
    const { id } = req.user;
    const {paymentType} = req.body;
    const cart = await Offline_Cart.findOne({ userId: id }).populate('cartItems');
    
    if (!cart) {
        return res.status(404).json(new ApiResponse(404, 'Cart not found', null));
    }

    try {
        let retailPrice =0;
        let totalProfit=0;
        const orderItems = [];
        for (const cartItem of cart.cartItems) {
           const product = await Product.findById(cartItem.product);
            const orderItem = new OfflineOrderItem({
                product: cartItem.product,
                quantity: cartItem.quantity,
                price: cartItem.price,
                retailPrice:product.retailPrice*cartItem.quantity,
                GST:cartItem.GST,
                totalProfit:(product.discountedPrice-product.retailPrice)*cartItem.quantity,
                finalPriceWithGST:cartItem.finalPrice_with_GST,
                discountedPrice: cartItem.discountedPrice,
                userId: id,
            });
            await orderItem.save();
            orderItems.push(orderItem._id); 
           retailPrice+= orderItem.retailPrice;
           totalProfit+=orderItem.totalProfit;
        }
       console.log(retailPrice);
        
        const order = new OfflineOrder({
            user: id,
            orderItems: orderItems,
            totalPrice: cart.totalPrice,
            totalDiscountedPrice: cart.totalDiscountedPrice,
            totalItem: cart.totalItem,
            discount: cart.discount,
            GST: cart.GST,  
            paymentType:paymentType,
            totalRetailPrice:retailPrice,
            totalProfit:totalProfit,
            finalPriceWithGST:cart.final_price_With_GST,
        });
        
        await order.save();
       const results= await  handleOfflineCounterSales(id,order);
       console.log(results);
        await Offline_CartItem.deleteMany({ _id: { $in: cart.cartItems.map(item => item._id) } });
        await Offline_Cart.findByIdAndDelete(cart._id);

        return res.status(200).json(new ApiResponse(200, 'Order placed successfully', order));
    } catch (error) {
        console.error(error);
        return res.status(500).json(new ApiResponse(500, 'Error placing order', error.message));
    }
});

const updateOrder = asyncHandler(async (req, res) => {
    const { id } = req.user;
    const { orderId, paymentType, updatedItems } = req.body;

    try {
        const order = await OfflineOrder.findOne({ _id: orderId, user: id }).populate('orderItems');
        if (!order) {
            return res.status(404).json(new ApiResponse(404, 'Order not found', null));
        }

        const oldOrderDate = new Date(order.createdAt);
        const newOrderDate = new Date();

        // Remove existing order items and calculate the differences to update the counter sales
        const oldOrder = {
            totalPrice: order.totalPrice,
            totalDiscountedPrice: order.totalDiscountedPrice,
            GST: order.GST,
            discount: order.discount,
            totalItem: order.totalItem,
            totalRetailPrice: order.totalRetailPrice,
            totalProfit: order.totalProfit,
            finalPriceWithGST: order.finalPriceWithGST,
        };

        let newRetailPrice = 0;
        let newTotalProfit = 0;
        const newOrderItems = [];
        for (const item of updatedItems) {
            const product = await Product.findById(item.product);
            const newOrderItem = new OfflineOrderItem({
                product: item.product,
                quantity: item.quantity,
                price: item.price,
                retailPrice: product.retailPrice * item.quantity,
                GST: item.GST,
                totalProfit: (product.discountedPrice - product.retailPrice) * item.quantity,
                finalPriceWithGST: item.finalPriceWithGST,
                discountedPrice: item.discountedPrice,
                userId: id,
            });
            await newOrderItem.save();
            newOrderItems.push(newOrderItem._id);
            newRetailPrice += newOrderItem.retailPrice;
            newTotalProfit += newOrderItem.totalProfit;
        }

        // Update order details
        const newOrder = {
            totalPrice: updatedItems.reduce((sum, item) => sum + item.price, 0),
            totalDiscountedPrice: updatedItems.reduce((sum, item) => sum + item.discountedPrice, 0),
            totalItem: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
            discount: updatedItems.reduce((sum, item) => sum + (item.price - item.discountedPrice), 0),
            GST: updatedItems.reduce((sum, item) => sum + item.GST, 0),
            totalRetailPrice: newRetailPrice,
            totalProfit: newTotalProfit,
            finalPriceWithGST: updatedItems.reduce((sum, item) => sum + item.finalPriceWithGST, 0),
        };

        order.orderItems = newOrderItems;
        order.totalPrice = newOrder.totalPrice;
        order.totalDiscountedPrice = newOrder.totalDiscountedPrice;
        order.totalItem = newOrder.totalItem;
        order.discount = newOrder.discount;
        order.GST = newOrder.GST;
        order.paymentType = paymentType;
        order.totalRetailPrice = newRetailPrice;
        order.totalProfit = newTotalProfit;
        order.finalPriceWithGST = newOrder.finalPriceWithGST;
        order.createdAt = newOrderDate;

        await order.save();

        // Adjust the offline counter sales with the differences
        await handleOfflineCounterSales(id, oldOrder, newOrder, oldOrderDate, newOrderDate);

        return res.status(200).json(new ApiResponse(200, 'Order updated successfully', order));
    } catch (error) {
        console.error(error);
        return res.status(500).json(new ApiResponse(500, 'Error updating order', error.message));
    }
});
const getAllOrders = asyncHandler(async (req, res) => {
    const { id } = req.user;
    try {
        const orders = await OfflineOrder.find({ user: id }).populate({
            path: 'orderItems',
            populate: {
                path: 'product',
                model: 'products'
            }
        });

        if (!orders) {
            return res.status(404).json(new ApiResponse(404, 'No orders found', null));
        }

        return res.status(200).json(new ApiResponse(200, 'Orders fetched successfully', orders));
    } catch (error) {
        console.error(error);
        return res.status(500).json(new ApiResponse(500, 'Error fetching orders', error.message));
    }
});

const cancelOrder = asyncHandler(async (req, res) => {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
        return res.status(404).json(new ApiResponse(404, 'Order not found', null));
    }

    if (order.orderStatus === "CANCELLED") {
        return res.status(400).json(new ApiResponse(400, 'Order is already cancelled', null));
    }

    order.orderStatus = "CANCELLED";
    await order.save();

    // Optional: Handle any related operations like refunding the payment, updating stock, or notifying the user
    // Example: Refund the payment
    // if (order.paymentDetails.paymentStatus === "PAID") {
    //     await refundPayment(order.paymentDetails.transactionId);
    // }

    return res.status(200).json(new ApiResponse(200, 'Order cancelled successfully', order));
});

export { cancelOrder, placeOrder, getAllOrders,updateOrder };
