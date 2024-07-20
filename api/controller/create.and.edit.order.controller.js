import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Offline_Cart from "../model/cart.model.js";
import OfflineOrderItem from "../model/orderItems.js";
import Product from "../model/product.model.js";
import OfflineOrder from "../model/order.model.js";
import Offline_CartItem from "../model/cartItem.model.js";
import { handleOfflineCounterSales, updateSalesData } from "./add.counter.sales.info.js";
import { handleAllTotalOfflineSales, TotalAllupdateSalesData } from "./add.total.sales.info.js";
import { handleTotalOfflineSales, TotalOfflineupdateSalesData } from "./add.offline.sales.info.js";


// Function to place an order
const placeOrder = asyncHandler(async (req, res) => {
    const { id } = req.user;
    const { paymentType, BillUser } = req.body;
    const cart = await Offline_Cart.findOne({ userId: id }).populate('cartItems');

    if (!cart) {
        return res.status(404).json(new ApiResponse(404, 'Cart not found', null));
    }

    try {
        let purchaseRate = 0;
        let totalProfit = 0;
        const orderItems = [];
        for (const cartItem of cart.cartItems) {
            const product = await Product.findById(cartItem.product);
            const orderItem = new OfflineOrderItem({
                product: cartItem.product,
                quantity: cartItem.quantity,
                price: cartItem.price,
                purchaseRate: product.purchaseRate * cartItem.quantity,
                GST: cartItem.GST,
                totalProfit: (product.discountedPrice-product.purchaseRate)*cartItem.quantity,
                finalPriceWithGST: cartItem.finalPrice_with_GST,
                discountedPrice: cartItem.discountedPrice,
                userId: id,
            });
            await orderItem.save();
            orderItems.push(orderItem._id);
            purchaseRate += orderItem.purchaseRate;
            totalProfit += orderItem.totalProfit;
        }

        const order = new OfflineOrder({
            user: id,
            orderItems: orderItems,
            Name: BillUser.name,
            mobileNumber: BillUser.mobileNumber,
            email: BillUser.email,
            totalPrice: cart.totalPrice,
            totalDiscountedPrice: cart.totalDiscountedPrice,
            totalItem: cart.totalItem,
            discount: cart.discount,
            GST: cart.GST,
            paymentType: paymentType,
            totalPurchaseRate: purchaseRate,
            totalProfit: totalProfit,
            finalPriceWithGST: cart.final_price_With_GST,
            orderDate:new Date(),
        });

        await order.save();
        await handleOfflineCounterSales(id, order);
        await handleTotalOfflineSales(order);
        await handleAllTotalOfflineSales(order);
        const results = await OfflineOrder.findById(order._id).populate({
            path:'orderItems',
            populate: {
                path: 'product',
                model: 'products'
            }
        });

        await Offline_CartItem.deleteMany({ _id: { $in: cart.cartItems.map(item => item._id) } });
        await Offline_Cart.findByIdAndDelete(cart._id);

        return res.status(200).json(new ApiResponse(200, 'Order placed successfully', results));
    } catch (error) {
        console.error(error);
        return res.status(500).json(new ApiResponse(500, 'Error placing order', error.message));
    }
});
// Function to remove item quantity from cart
const removeItemQuantityOrder = asyncHandler(async (req, res) => {
    const {id} = req.user;
    const { itemId, orderId,paymentType } = req.body;

    try {
        const cartItem = await OfflineOrderItem.findById(itemId);

        if (!cartItem) {
            return res.status(404).json(new ApiResponse(404, 'Cart item not found', null));
        }

        const product = await Product.findById(cartItem.product);

        if (cartItem.quantity > 1) {
            cartItem.quantity -= 1;
            cartItem.price -= product.price;
            cartItem.GST -= product.GST;
            cartItem.purchaseRate -= product.purchaseRate;
            cartItem.totalProfit -= (product.discountedPrice - product.purchaseRate);
            cartItem.finalPriceWithGST -= (product.discountedPrice + product.GST);
            cartItem.discountedPrice -= product.discountedPrice;
            cartItem.updatedAt = new Date();
            product.quantity+=1;
            await product.save();
            await cartItem.save();
             
            const cart = await OfflineOrder.findById(orderId);
            const oldOrder=cart;
            if (cart) {
                const cartItemExists = cart.orderItems.some(item => item.toString() === cartItem._id.toString());
                if (cartItemExists) {
                    cart.user=id,
                    cart.paymentType=paymentType,
                    cart.orderStatus='Update',
                    cart.totalPrice -= product.price;
                    cart.totalDiscountedPrice -= product.discountedPrice;
                    cart.totalPurchaseRate -= product.purchaseRate;
                    cart.GST -= product.GST;
                    cart.discount -= (product.price - product.discountedPrice);
                    cart.totalProfit -= (product.discountedPrice - product.purchaseRate);
                    cart.finalPriceWithGST -= (product.discountedPrice + product.GST);
                    await cart.save();
                   await updateSalesData(oldOrder.user,oldOrder,cart);
                   await TotalAllupdateSalesData(oldOrder,cart);
                   await TotalOfflineupdateSalesData(oldOrder,cart);
                }
            }
            
            return res.status(200).json(new ApiResponse(200, 'Cart item quantity decreased successfully',cartItem,cart ));
        } else {
            return res.status(400).json(new ApiResponse(400, 'Minimum quantity reached for this item', null));
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json(new ApiResponse(500, 'Error decreasing cart item quantity', error.message));
    }
});

// Function to remove one cart item
const RemoveOneItemOnOrder = asyncHandler(async (req, res) => {
    const { id } = req.user;
    const { itemId, orderId,paymentType } = req.body;

    try {
        const cartItem = await OfflineOrderItem.findById(itemId);

        if (!cartItem) {
            return res.status(404).json(new ApiResponse(404, 'Cart item not found', null));
        }

        if (cartItem.userId.toString() !== id) {
            return res.status(403).json(new ApiResponse(403, 'Unauthorized to delete this cart item', null));
        }
        const product = await Product.findById(cartItem.product);
        const cart = await OfflineOrder.findById(orderId);
        const cartItemExists = cart.orderItems.some(item => item.toString() === cartItem._id.toString());
        if (cartItem.quantity > 0 && cartItemExists) {
            cart.user = id,
            cart.orderItems.pull(cartItem._id);
            cart.paymentType=paymentType,
            cart.orderStatus='Update',
            cart.totalPrice -= cartItem.price;
            cart.totalDiscountedPrice -=cartItem.discountedPrice;
            cart.totalPurchaseRate -= cartItem.purchaseRate;
            cart.GST -= cartItem.GST;
            cart.totalItem-=1,
            cart.discount -= (cartItem.price-cartItem.discountedPrice);
            cart.totalProfit -= cartItem.totalProfit;
            cart.finalPriceWithGST -= cartItem.finalPriceWithGST;
            await cart.save();
            product.quantity+=cartItem.quantity,
            product.save();
            await OfflineOrderItem.findByIdAndRemove(itemId);
            await updateSalesData(oldOrder.user,oldOrder,cart);
            await TotalAllupdateSalesData(oldOrder,cart);
            await TotalOfflineupdateSalesData(oldOrder,cart);
        }

        return res.status(200).json(new ApiResponse(200, 'Cart item deleted successfully', cartItem,cart));
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// Export functions
export {placeOrder, removeItemQuantityOrder, RemoveOneItemOnOrder };
