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
import { createClient, reduceClient } from "./Client.controller.js";
import CounterUser from "../model/user.model.js";
import { Client } from "../model/Client.model.js";

// Function to place an order
const AddCustomOrder = asyncHandler(async (req, res) => {
    const { id } = req.user; // User ID
    const { orderId, productCode, discountedPrice, quantity, price, discount, GST, finalPriceWithGST, OneUnit } = req.body; // Request Body with Custom Info

    try {
        // Fetch user from database
        const user = await CounterUser.findById(id);
        if (!user) {
            return res.status(401).json(new ApiResponse(401, 'User not found', null));
        }

        // Find existing order by orderId
        const order = await OfflineOrder.findById(orderId).populate('orderItems');
        const oldOrder = JSON.parse(JSON.stringify(order)); // Save the old order state for reference

        // If order doesn't exist, return error
        if (!order) {
            return res.status(404).json(new ApiResponse(404, 'Order not found', null));
        }

        // Find product by barcode
        const product = await Product.findOne({ BarCode: productCode });
        if (!product) {
            return res.status(404).json(new ApiResponse(404, 'Product not found', null));
        }

        // Check if this product is already in the order
        const orderItem = order.orderItems.find(item => item.product.toString() === product._id.toString());
        const oldItem = JSON.parse(JSON.stringify(orderItem)); // Save the old item state for reference

        if (orderItem) {
            // First, remove the old item values from the order totals
            let value=0;
            if(product.price!=0 && product.price)
            {
               value=product.price-oldItem.OneUnit;
            }
            else{
               value=product.discountedPrice-oldItem.OneUnit;
            }
            order.totalPrice -= oldItem.price;
            order.totalDiscountedPrice -= oldItem.discountedPrice;
            order.GST -= oldItem.GST;
            order.discount -= value*oldItem.quantity;
            order.finalPriceWithGST -= oldItem.finalPriceWithGST;
            order.totalProfit -= oldItem.totalProfit;
            order.totalPurchaseRate -= oldItem.purchaseRate;
         
            let remainingAmount = oldItem.finalPriceWithGST; // Start with the item's price
            let data = {
                Type: 'Client',
                Name: order.Name,
                Mobile: order.mobileNumber,
                Purchase: oldItem.finalPriceWithGST,
                Closing: (order.paymentType.borrow >= oldItem.finalPriceWithGST) ? oldItem.finalPriceWithGST : 0,
            }
            const results = await reduceClient(data);

            // Check and deduct from borrow first

            // First, check and deduct from Borrow
            if (remainingAmount > 0 && order.paymentType.borrow > 0) {
                if (order.paymentType.borrow >= remainingAmount) {
                    order.paymentType.borrow -= remainingAmount;
                    remainingAmount = 0; // All amount is covered by borrow
                } else {
                    remainingAmount -= order.paymentType.borrow; // Deduct whatever is available in borrow
                    order.paymentType.borrow = 0; // Borrow is exhausted  
                }
            }

            // Card Payment
            if (remainingAmount > 0 && order.paymentType.Card > 0) {
                if (order.paymentType.Card >= remainingAmount) {
                    order.paymentType.Card -= remainingAmount;
                    remainingAmount = 0; // All amount is covered by Card
                } else {
                    remainingAmount -= cart.paymentType.Card; // Deduct whatever is available in Card
                    cart.paymentType.Card = 0; // Card is exhausted
                }
            }

            // UPI Payment
            if (remainingAmount > 0 && order.paymentType.UPI > 0) {
                if (order.paymentType.UPI >= remainingAmount) {
                    order.paymentType.UPI -= remainingAmount;
                    remainingAmount = 0; // All amount is covered by UPI
                } else {
                    remainingAmount -= order.paymentType.UPI; // Deduct whatever is available in UPI
                    order.paymentType.UPI = 0; // UPI is exhausted
                }
            }

            // Cash Payment
            if (remainingAmount > 0 && order.paymentType.cash > 0) {
                if (order.paymentType.cash >= remainingAmount) {
                    order.paymentType.cash -= remainingAmount;
                    remainingAmount = 0; // All amount is covered by Cash
                } else {
                    remainingAmount -= order.paymentType.cash; // Deduct whatever is available in Cash
                    order.paymentType.cash = 0; // Cash is exhausted
                }
            }

            await order.save();
            // At this point, remainingAmount should be 0, or you can handle if any uncovered amount remains.

            // Reset the old item values
            orderItem.quantity = 0;
            orderItem.price = 0;
            orderItem.discountedPrice = 0;
            orderItem.GST = 0;
            orderItem.finalPriceWithGST = 0;
            orderItem.purchaseRate=0;
            orderItem.totalProfit=0;
            orderItem.type='custom',
            orderItem.updatedAt = new Date();
            await orderItem.save();
        }

        // Restore the product's stock by adding back the old quantity
        product.quantity += oldItem ? oldItem.quantity : 0;
        await product.save();

        // Update the product stock by reducing the new quantity
        product.quantity -= quantity;
        await product.save();

        // Add new values to the order and order item
        if (orderItem) {
            orderItem.quantity = quantity;
            orderItem.OneUnit =OneUnit;
            orderItem.price = product.price * quantity;
            orderItem.discountedPrice = discountedPrice;
            orderItem.GST = GST * quantity;
            orderItem.purchaseRate=product.purchaseRate*quantity;
            orderItem.totalProfit=(OneUnit-product.purchaseRate)*quantity;
            orderItem.finalPriceWithGST = finalPriceWithGST;
            orderItem.updatedAt = new Date();
            await orderItem.save();
        } else {
            // Create a new order item if it doesn't exist
            orderItem = new OfflineOrderItem({
                userId: id,
                product: product._id,
                quantity: quantity,
                price: product.price * quantity,
                OneUnit :OneUnit,
                purchaseRate:product.purchaseRate*quantity,
                discountedPrice: discountedPrice,
                totalProfit:(OneUnit-product.purchaseRate)*quantity,
                GST: GST * quantity,
                finalPriceWithGST: finalPriceWithGST,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            await orderItem.save();
            order.orderItems.push(orderItem._id); // Add the new item to the order
        }

        // Update order totals with new values
        order.user = id;
        order.totalPrice += orderItem.price;
        order.totalDiscountedPrice += discountedPrice;
        order.GST += orderItem.GST;
        order.discount+=discount,
        order.finalPriceWithGST += finalPriceWithGST;
        order.paymentType.cash += finalPriceWithGST;
        order.totalProfit += orderItem.totalProfit;
        order.totalPurchaseRate += orderItem.purchaseRate;
        order.updatedAt = new Date();
  
        // Save the updated order
        await order.save();
        let Type = 'Client'
        let Name = order.Name;
        let Mobile = order.mobileNumber;
        const client = await Client.findOne({ Type, Name, Mobile });
        const clientReq = {
            body: {
                Type: 'Client',
                Name: order.Name,
                Email: order.email || "",
                Address: client.Address,
                State: client.State,
                Mobile: order.mobileNumber,
                Purchase: (product.discountedPrice + product.GST) || 0,
                Closing: 0,
            }
        };

        const r = await createClient(clientReq);
        console.log(r);
        await order.save();
        await updateSalesData(oldOrder.user, oldOrder, order);
        await TotalAllupdateSalesData(oldOrder, order);
        await TotalOfflineupdateSalesData(oldOrder, order);

        // Return the updated order with populated order items
        const updatedOrder = await OfflineOrder.findById(order._id).populate({
            path: 'orderItems',
            populate: {
                path: 'product',
                model: 'products',
            }
        });

        return res.status(200).json(new ApiResponse(200, 'Order updated successfully', updatedOrder));

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message });
    }
});

const AddOrder = asyncHandler(async (req, res) => {
    const { id } = req.user;
    const { orderId, productCode } = req.body;

    try {
        // Find existing order by orderId
        let order = await OfflineOrder.findById(orderId).populate('orderItems');
        const oldOrder = JSON.parse(JSON.stringify(order));
        // If order doesn't exist, return error
        if (!order) {
            return res.status(404).json(new ApiResponse(404, 'Order not found', null));
        }

        // Find product by barcode
        const product = await Product.findOne({ BarCode: productCode });
        if (!product) {
            return res.status(404).json(new ApiResponse(404, 'Product not found', null));
        }

        // Find if this product already exists in the order
        let existingOrderItem = order.orderItems.find(item => item.product.toString() === product._id.toString());

        let purchaseRate = 0;
        let totalProfit = 0;
       let oneUnit=0; 
        if (existingOrderItem) {
            oneUnit = existingOrderItem.discountedPrice/ existingOrderItem.quantity;
            // If product already exists in order, update the quantity and prices
            existingOrderItem.quantity += 1;
            existingOrderItem.price += product.price;
            existingOrderItem.discountedPrice += oneUnit;
            existingOrderItem.GST += product.GST;
            existingOrderItem.purchaseRate+=product.purchaseRate;
            existingOrderItem.finalPriceWithGST += (oneUnit + product.GST);
            existingOrderItem.updatedAt = new Date();
             
            // Recalculate totalProfit for existing items
            existingOrderItem.totalProfit = Math.max(0, existingOrderItem.discountedPrice - existingOrderItem.purchaseRate);

            await existingOrderItem.save();
        } else {
            // If product is not already in the order, create a new OfflineOrderItem
            oneUnit =product.discountedPrice;
            const newOrderItem = new OfflineOrderItem({
                product: product._id,
                quantity: 1,
                price: product.price,
                purchaseRate: product.purchaseRate,
                GST: product.GST,
                OneUnit:product.discountedPrice,
                finalPriceWithGST: product.discountedPrice + product.GST,
                discountedPrice: product.discountedPrice,
                userId: id,
                totalProfit: Math.max(0, product.discountedPrice - product.purchaseRate), // Ensure totalProfit is set
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            await newOrderItem.save();
            order.orderItems.push(newOrderItem._id); // Add new order item to the order

            purchaseRate += newOrderItem.purchaseRate;
            totalProfit += newOrderItem.totalProfit; // Accumulate totalProfit
        }


        // Update order totals
        order.totalPrice += product.price;
        order.totalDiscountedPrice += oneUnit;
        order.totalItem += 1;
        order.GST += product.GST;
        order.paymentType.cash += (oneUnit + product.GST);
        order.finalPriceWithGST += (oneUnit + product.GST);
        order.totalPurchaseRate += product.purchaseRate;
        order.totalProfit += (oneUnit- product.purchaseRate);
        order.updatedAt = new Date();

        // Save updated order
        await order.save();
        let Type = 'Client'
        let Name = order.Name;
        let Mobile = order.mobileNumber;
        const client = await Client.findOne({ Type, Name, Mobile });
        const clientReq = {
            body: {
                Type: 'Client',
                Name: order.Name,
                Email: order.email || "",
                Address: client.Address,
                State: client.State,
                Mobile: order.mobileNumber,
                Purchase: (product.discountedPrice + product.GST) || 0,
                Closing: 0,
            }
        };

        const r = await createClient(clientReq);
        console.log(r);
        await order.save();
        await updateSalesData(oldOrder.user, oldOrder, order);
        await TotalAllupdateSalesData(oldOrder, order);
        await TotalOfflineupdateSalesData(oldOrder, order);

        const results = await OfflineOrder.findById(order._id).populate({
            path: 'orderItems',
            populate: {
                path: 'product',
                model: 'products'
            }
        });
        return res.status(200).json(new ApiResponse(200, 'Product added to order successfully', order));

    } catch (error) {
        console.error(error);
        return res.status(500).json(new ApiResponse(500, 'Error adding product to order', error.message));
    }
});

const placeOrder = asyncHandler(async (req, res) => {
    const { id } = req.user;
    // const id=`669b9afa72e1e9138e2a64a3`;
    const { paymentType, BillUser } = req.body;
console.log(paymentType);
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
            if (cartItem.type == 'custom') {
                const orderItem = new OfflineOrderItem({
                    product: cartItem.product,
                    quantity: cartItem.quantity,
                    price: cartItem.price,
                    purchaseRate: product.purchaseRate * cartItem.quantity,
                    GST: cartItem.GST,
                    type: cartItem.type,
                    OneUnit:cartItem.OneUnit,
                    totalProfit: Math.max(0, (cartItem.discountedPrice) - (product.purchaseRate * cartItem.quantity)),
                    finalPriceWithGST: cartItem.finalPrice_with_GST,
                    discountedPrice: cartItem.discountedPrice,
                    userId: id,
                });
                await orderItem.save();
                orderItems.push(orderItem._id);
                purchaseRate += orderItem.purchaseRate;
                totalProfit += orderItem.totalProfit;
            }
            else {
                const orderItem = new OfflineOrderItem({
                    product: cartItem.product,
                    quantity: cartItem.quantity,
                    price: cartItem.price,
                    purchaseRate: product.purchaseRate * cartItem.quantity,
                    GST: cartItem.GST,
                    OneUnit:cartItem.OneUnit,
                    totalProfit: Math.max(0, (product.discountedPrice - product.purchaseRate) * cartItem.quantity),
                    finalPriceWithGST: cartItem.finalPrice_with_GST,
                    discountedPrice: cartItem.discountedPrice,
                    userId: id,
                });
                await orderItem.save();
                orderItems.push(orderItem._id);
                purchaseRate += orderItem.purchaseRate;
                totalProfit += orderItem.totalProfit;
            }
        }
        if (cart.discount < 0) {
            cart.discount = 0;
        }
        const order = await new OfflineOrder({
            user: id,
            orderItems: orderItems,
            Name: BillUser.name,
            mobileNumber: BillUser.Mobile,
            email: BillUser.email,
            totalPrice: cart.totalPrice,
            totalDiscountedPrice: cart.totalDiscountedPrice,
            totalItem: cart.totalItem,
            discount: cart.discount,
            GST: cart.GST,
            paymentType: await paymentType,
            totalPurchaseRate: purchaseRate,
            totalProfit: totalProfit,
            finalPriceWithGST: cart.final_price_With_GST,
            orderDate: new Date(),
        });
        const clientReq = {
            body: {
                Type: 'Client',
                Name: BillUser.name,
                Email: BillUser.email || "",
                Address: BillUser.Address,
                State: BillUser.State,
                Mobile: BillUser.Mobile,
                Purchase: cart.final_price_With_GST || 0,
                Closing: paymentType.borrow || 0,
            }
        };

        const r = await createClient(clientReq);
        console.log(r);
        await order.save();
        await handleOfflineCounterSales(id, order);
        await handleTotalOfflineSales(order);
        await handleAllTotalOfflineSales(order);

        const results = await OfflineOrder.findById(order._id).populate({
            path: 'orderItems',
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
    const { id } = req.user;
    const { iteamId, orderId} = req.body;
    console.log(req.body)
    try {
        const cartItem = await OfflineOrderItem.findById(iteamId);

        if (!cartItem) {
            return res.status(404).json(new ApiResponse(404, 'Cart item not found', null));
        }


        const product = await Product.findById(cartItem.product);
        const oneUnit = cartItem.discountedPrice / cartItem.quantity;
        const oneUnitProfit = parseFloat(cartItem.totalProfit / cartItem.quantity);
        if (cartItem.quantity > 1) {
            cartItem.quantity -= 1;
            cartItem.price -= product.price;
            cartItem.GST -= product.GST;
            cartItem.purchaseRate -= product.purchaseRate;
            cartItem.totalProfit -= Math.max(0, (oneUnitProfit));
            cartItem.finalPriceWithGST -= (oneUnit + product.GST);
            cartItem.discountedPrice -= oneUnit;
            cartItem.updatedAt = new Date();
            product.quantity += 1;
            await product.save();
            await cartItem.save();

            const cart = await OfflineOrder.findById(orderId);
            let data = {
                Type: 'Client',
                Name: cart.Name,
                Mobile: cart.mobileNumber,
                Purchase: oneUnit,
                Closing: (cart.paymentType.borrow >= oneUnit) ? oneUnit : 0,
            }
            const results = await reduceClient(data);
            console.log(results);
            const oldOrder = JSON.parse(JSON.stringify(cart));
            if (cart) {
                const cartItemExists = cart.orderItems.some(item => item.toString() === cartItem._id.toString());
                if (cartItemExists) {
                    const discount = await Math.max(product.price - oneUnit, 0);
                    cart.user = id,
                        cart.orderStatus = 'Update',
                        cart.totalPrice -= product.price;

                    cart.totalDiscountedPrice -= oneUnit;
                    cart.totalPurchaseRate -= product.purchaseRate;
                    cart.GST -= product.GST;
                    cart.discount -= discount;
                    cart.totalProfit -= Math.max(0, oneUnitProfit);
                    cart.finalPriceWithGST -= (oneUnit + product.GST);
                    let remainingAmount = (oneUnit + product.GST); // Start with the item's price


                    // First, check and deduct from Borrow
                    if (remainingAmount > 0 && cart.paymentType.borrow > 0) {
                        if (cart.paymentType.borrow >= remainingAmount) {
                            cart.paymentType.borrow -= remainingAmount;
                            remainingAmount = 0; // All amount is covered by borrow
                        } else {
                            remainingAmount -= cart.paymentType.borrow; // Deduct whatever is available in borrow
                            cart.paymentType.borrow = 0; // Borrow is exhausted  
                        }
                    }
        
                    // Card Payment
                    if (remainingAmount > 0 && cart.paymentType.Card > 0) {
                        if (cart.paymentType.Card >= remainingAmount) {
                            cart.paymentType.Card -= remainingAmount;
                            remainingAmount = 0; // All amount is covered by Card
                        } else {
                            remainingAmount -= cart.paymentType.Card; // Deduct whatever is available in Card
                            cart.paymentType.Card = 0; // Card is exhausted
                        }
                    }
        
                    // UPI Payment
                    if (remainingAmount > 0 && cart.paymentType.UPI > 0) {
                        if (cart.paymentType.UPI >= remainingAmount) {
                            cart.paymentType.UPI -= remainingAmount;
                            remainingAmount = 0; // All amount is covered by UPI
                        } else {
                            remainingAmount -= cart.paymentType.UPI; // Deduct whatever is available in UPI
                            cart.paymentType.UPI = 0; // UPI is exhausted
                        }
                    }
        
                    // Cash Payment
                    if (remainingAmount > 0 && cart.paymentType.cash > 0) {
                        if (cart.paymentType.cash >= remainingAmount) {
                            cart.paymentType.cash -= remainingAmount;
                            remainingAmount = 0; // All amount is covered by Cash
                        } else {
                            remainingAmount -= cart.paymentType.cash; // Deduct whatever is available in Cash
                            cart.paymentType.cash = 0; // Cash is exhausted
                        }
                    }
        
        
                    // At this point, remainingAmount should be 0, or you can handle if any uncovered amount remains.

                    await cart.save();
                    await updateSalesData(oldOrder.user, oldOrder, cart);
                    await TotalAllupdateSalesData(oldOrder, cart);
                    await TotalOfflineupdateSalesData(oldOrder, cart);
                }
            }

            return res.status(200).json(new ApiResponse(200, 'Cart item quantity decreased successfully', cartItem, cart));
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
    const { itemId, orderId } = req.body;

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
        const oldOrder = JSON.parse(JSON.stringify(cart));
        const cartItemExists = cart.orderItems.some(item => item.toString() === cartItem._id.toString());
        let data = {
            Type: 'Client',
            Name: cart.Name,
            Mobile: cart.mobileNumber,
            Purchase: cartItem.finalPriceWithGST,
            Closing: (cart.paymentType.borrow >= cartItem.finalPriceWithGST) ? cartItem.finalPriceWithGST : 0,
        }
        const results = await reduceClient(data);
        console.log(results);
        if (cartItem.quantity > 0 && cartItemExists) {
            const discount = await Math.max(cartItem.price - cartItem.discountedPrice, 0);
            cart.user = id,
                cart.orderItems.pull(cartItem._id);
            cart.orderStatus = 'Update',
                cart.totalPrice -= cartItem.price;
            cart.totalDiscountedPrice -= cartItem.discountedPrice;
            cart.totalPurchaseRate -= cartItem.purchaseRate;
            cart.GST -= cartItem.GST;
            cart.totalItem -= 1,
                cart.discount -= discount;
            cart.totalProfit -= cartItem.totalProfit;
            cart.finalPriceWithGST -= cartItem.finalPriceWithGST;
            let remainingAmount = cartItem.finalPriceWithGST; // Start with the item's price
            // Borrow Payment
            if (remainingAmount > 0 && cart.paymentType.borrow > 0) {
                if (cart.paymentType.borrow >= remainingAmount) {
                    cart.paymentType.borrow -= remainingAmount;
                    remainingAmount = 0; // All amount is covered by borrow
                } else {
                    remainingAmount -= cart.paymentType.borrow; // Deduct whatever is available in borrow
                    cart.paymentType.borrow = 0; // Borrow is exhausted  
                }
            }

            // Card Payment
            if (remainingAmount > 0 && cart.paymentType.Card > 0) {
                if (cart.paymentType.Card >= remainingAmount) {
                    cart.paymentType.Card -= remainingAmount;
                    remainingAmount = 0; // All amount is covered by Card
                } else {
                    remainingAmount -= cart.paymentType.Card; // Deduct whatever is available in Card
                    cart.paymentType.Card = 0; // Card is exhausted
                }
            }

            // UPI Payment
            if (remainingAmount > 0 && cart.paymentType.UPI > 0) {
                if (cart.paymentType.UPI >= remainingAmount) {
                    cart.paymentType.UPI -= remainingAmount;
                    remainingAmount = 0; // All amount is covered by UPI
                } else {
                    remainingAmount -= cart.paymentType.UPI; // Deduct whatever is available in UPI
                    cart.paymentType.UPI = 0; // UPI is exhausted
                }
            }

            // Cash Payment
            if (remainingAmount > 0 && cart.paymentType.cash > 0) {
                if (cart.paymentType.cash >= remainingAmount) {
                    cart.paymentType.cash -= remainingAmount;
                    remainingAmount = 0; // All amount is covered by Cash
                } else {
                    remainingAmount -= cart.paymentType.cash; // Deduct whatever is available in Cash
                    cart.paymentType.cash = 0; // Cash is exhausted
                }
            }


            // At this point, remainingAmount should be 0 or any remaining uncovered amount.


            await cart.save();
            product.quantity += cartItem.quantity,
                product.save();
            await OfflineOrderItem.findByIdAndDelete(itemId);
            await updateSalesData(oldOrder.user, oldOrder, cart);
            await TotalAllupdateSalesData(oldOrder, cart);
            await TotalOfflineupdateSalesData(oldOrder, cart);
        }

        return res.status(200).json(new ApiResponse(200, 'Cart item deleted successfully', cartItem, cart));
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});


// to get order by id
const getOrderById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const order = await OfflineOrder.findById(id).populate({
            path: 'orderItems',
            populate: {
                path: 'product',
                model: 'products',
            },
        });

        if (!order) {
            return res.status(404).json(new ApiResponse(404, 'Order not found', null));
        }

        return res.status(200).json(new ApiResponse(200, 'Order retrieved successfully', order));
    } catch (error) {
        console.error(error);
        return res.status(500).json(new ApiResponse(500, 'Error retrieving order', error.message));
    }
});

// Function to update order
const updateOrder = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const UpdateUser = req.body;
    console.log("Request body:", UpdateUser);

    try {
        const order = await OfflineOrder.findById(id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Log the existing order before any updates
        console.log("Existing Order:", order);

        // Update the client information
        const Type = 'Client';
        const Name = order.Name;
        const Mobile = order.mobileNumber;
        const existingClient = await Client.findOne({ Type, Name, Mobile });
        console.log("Existing Client:", existingClient);

        if (existingClient) {
            existingClient.Name = UpdateUser.name || order.Name;
            existingClient.Mobile = UpdateUser.mobileNumber || order.mobileNumber;
            existingClient.Email = UpdateUser.email || order.email;
            await existingClient.save();
            console.log("Updated Client:", existingClient);
        } else {
            return res.status(404).json({ message: 'Client not found' });
        }

        // Update the order fields
        order.Name = UpdateUser.name || order.Name;
        order.mobileNumber = UpdateUser.mobileNumber || order.mobileNumber;
        order.email = UpdateUser.email || order.email;

        // Log the updated order before saving
        console.log("Updated Order:", order);

        await order.save();

        const results = await OfflineOrder.findById(order._id).populate({
            path: 'orderItems',
            populate: {
                path: 'product',
                model: 'products'
            }
        });

        return res.status(200).json({ statusCode: 200, success: true, message: 'Order updated successfully', data: results });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ statusCode: 500, success: false, message: 'Error updating order', data: error.message });
    }
});

// const updateOrder = asyncHandler(async (req, res) => {
//     const { id } = req.params;
//     const UpdateUser = req.body;
//   console.log(req.body);
//     try {
//       const order = await OfflineOrder.findById(id);

//       if (!order) {
//         return res.status(404).json({ message: 'Order not found' });
//       }

//       // Update order items if provided
//       // Uncomment and modify the following section if you want to update order items
//       /*
//       if (orderItems && orderItems.length > 0) {
//         let purchaseRate = 0;
//         let totalProfit = 0;
//         const updatedOrderItems = [];

//         for (const item of orderItems) {
//           const product = await Product.findById(item.product);
//           const updatedOrderItem = {
//             product: item.product,
//             quantity: item.quantity,
//             price: item.price,
//             purchaseRate: product.purchaseRate * item.quantity,
//             GST: item.GST,
//             totalProfit: Math.max(0, (product.discountedPrice - product.purchaseRate) * item.quantity),
//             finalPriceWithGST: item.finalPriceWithGST,
//             discountedPrice: item.discountedPrice,
//             userId: order.user,
//           };

//           if (item._id) {
//             await OfflineOrderItem.findByIdAndUpdate(item._id, updatedOrderItem);
//             updatedOrderItems.push(item._id);
//           } else {
//             const newOrderItem = new OfflineOrderItem(updatedOrderItem);
//             await newOrderItem.save();
//             updatedOrderItems.push(newOrderItem._id);
//           }

//           purchaseRate += updatedOrderItem.purchaseRate;
//           totalProfit += updatedOrderItem.totalProfit;
//         }

//         order.orderItems = updatedOrderItems;
//         order.totalPurchaseRate = purchaseRate;
//         order.totalProfit = totalProfit;
//       }
//       */

//    //   Update the rest of the order fields
//       const Type = 'Client';
//       const Name = order.Name;
//       const Mobile = order.mobileNumber;
//       const existingClient = await Client.findOne({ Type, Name, Mobile });
//   console.log(existingClient)
//       if (existingClient) {
//         existingClient.Name =( UpdateUser.name)? UpdateUser.name : order.Name;
//         existingClient.Mobile = (UpdateUser.mobileNumber)?UpdateUser.mobileNumber:order.mobileNumber;
//         existingClient.Email =( UpdateUser.email )? UpdateUser.email : order.email;
//         await existingClient.save();
//         console.log(existingClient);
//       } else {
//         // Handle the case where no existing client is found
//         return res.status(404).json({ message: 'Client not found' });
//       }
//   console.log(UpdateUser)
//       order.Name = (UpdateUser.name)?UpdateUser.name: order.Name;
//       order.mobileNumber = (UpdateUser.mobileNumber)?UpdateUser.mobileNumber:  order.mobileNumber;
//       order.email =(UpdateUser.email)? UpdateUser.email : order.email;


//       await order.save();
//   console.log(order)
//       const results = await OfflineOrder.findById(order._id).populate({
//         path: 'orderItems',
//         populate: {
//           path: 'product',
//           model: 'products'
//         }
//       });

//       return res.status(200).json({ statusCode: 200, success: true, message: 'Order updated successfully', data: results });
//     } catch (error) {
//       console.error(error);
//       return res.status(500).json({ statusCode: 500, success: false, message: 'Error updating order', data: error.message });
//     }
//   });

// to cancel an Order
const cancelledOrder = asyncHandler(async (req, res) => {
    const { id } = req.user;
    const { orderId } = req.body;

    try {
        const cart = await OfflineOrder.findById(orderId);
        if (!cart) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        const oldOrder = cart.toObject(); // Creating a plain object copy of the cart
        const cancelFields = {
            totalPrice: 0,
            totalDiscountedPrice: 0,
            GST: 0,
            discount: 0,
            totalItem: 0,
            totalPurchaseRate: 0,
            totalProfit: 0,
            finalPriceWithGST: 0,
        };
        let data = {
            Type: 'Client',
            Name: cart.Name,
            Mobile: cart.mobileNumber,
            Purchase: cart.finalPriceWithGST,
            Closing: cart.paymentType.borrow,
        }
        const results = await reduceClient(data)
        console.log(results);
        cart.user = id;
        cart.orderStatus = 'Cancel';
        cart.totalPrice = cancelFields.totalPrice;
        cart.totalDiscountedPrice = cancelFields.totalDiscountedPrice;
        cart.GST = cancelFields.GST;
        cart.discount = cancelFields.discount;
        cart.totalItem = cancelFields.totalItem;
        cart.totalPurchaseRate = cancelFields.totalPurchaseRate;
        cart.totalProfit = cancelFields.totalProfit;
        cart.finalPriceWithGST = cancelFields.finalPriceWithGST;

        await cart.save();

        for (const item of cart.orderItems) {
            const product = await Product.findById(item.product);
            if (product) {
                product.quantity += item.quantity;
                await product.save();
            }
            await OfflineOrderItem.findByIdAndDelete(item);
        }

        await updateSalesData(oldOrder.user, oldOrder, cancelFields);
        await TotalAllupdateSalesData(oldOrder, cancelFields);
        await TotalOfflineupdateSalesData(oldOrder, cancelFields);

        return res.status(200).json(new ApiResponse(200, 'Order cancelled successfully', cart));
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message });
    }
});


// Export functions
export { placeOrder, removeItemQuantityOrder, RemoveOneItemOnOrder, getOrderById, updateOrder, cancelledOrder, AddOrder, AddCustomOrder };