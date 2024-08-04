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
    // const id=`669b9afa72e1e9138e2a64a3`;
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
            if(cartItem.type=='custom'){
                const orderItem = new OfflineOrderItem({
                    product: cartItem.product,
                    quantity: cartItem.quantity,
                    price: cartItem.price,
                    purchaseRate: product.purchaseRate * cartItem.quantity,
                    GST: cartItem.GST,
                    type:cartItem.type,
                    totalProfit:(cartItem.discountedPrice)-(product.purchaseRate*cartItem.quantity),
                    finalPriceWithGST: cartItem.finalPrice_with_GST,
                    discountedPrice: cartItem.discountedPrice,
                    userId: id,
                });
                await orderItem.save();
                orderItems.push(orderItem._id);
                purchaseRate += orderItem.purchaseRate;
                totalProfit += orderItem.totalProfit;
            }
            else{
                const orderItem = new OfflineOrderItem({
                    product: cartItem.product,
                    quantity: cartItem.quantity,
                    price: cartItem.price,
                    purchaseRate: product.purchaseRate * cartItem.quantity,
                    GST: cartItem.GST,
                    totalProfit:(product.discountedPrice-product.purchaseRate)*cartItem.quantity ,
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
           if(cart.discount<0)
           {
            cart.discount=0;
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
    const { iteamId,orderId,paymentType } = req.body;
   console.log(req.body)
    try {
        const cartItem = await OfflineOrderItem.findById(iteamId);
        
        if (!cartItem) {
            return res.status(404).json(new ApiResponse(404, 'Cart item not found', null));
        }
        if (cartItem.type=='custom') {
            return res.status(404).json(new ApiResponse(404, 'Cart item is custom', null));
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
            const oldOrder = JSON.parse(JSON.stringify(cart)); 
            if (cart) {
                const cartItemExists = cart.orderItems.some(item => item.toString() === cartItem._id.toString());
                if (cartItemExists) {
                    const discount =await Math.max(product.price - product.discountedPrice, 0);
                    cart.user=id,
                    cart.paymentType=paymentType,
                    cart.orderStatus='Update',
                    cart.totalPrice -= product.price;
                    cart.totalDiscountedPrice -= product.discountedPrice;
                    cart.totalPurchaseRate -= product.purchaseRate;
                    cart.GST -= product.GST;
                    cart.discount -= discount;
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
        const oldOrder = JSON.parse(JSON.stringify(cart));  
        const cartItemExists = cart.orderItems.some(item => item.toString() === cartItem._id.toString());
        if (cartItem.quantity > 0 && cartItemExists) {
            const discount =await Math.max(cartItem.price - cartItem.discountedPrice, 0);
            cart.user = id,
            cart.orderItems.pull(cartItem._id);
            cart.paymentType=paymentType,
            cart.orderStatus='Update',
            cart.totalPrice -= cartItem.price;
            cart.totalDiscountedPrice -=cartItem.discountedPrice;
            cart.totalPurchaseRate -= cartItem.purchaseRate;
            cart.GST -= cartItem.GST;
            cart.totalItem-=1,
            cart.discount -= discount;
            cart.totalProfit -= cartItem.totalProfit;
            cart.finalPriceWithGST -= cartItem.finalPriceWithGST;
            await cart.save();
            product.quantity+=cartItem.quantity,
            product.save();
            await OfflineOrderItem.findByIdAndDelete(itemId);
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
    const { paymentType, BillUser, orderItems, ...rest } = req.body;
  
    try {
      const order = await OfflineOrder.findById(id);
  
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      // Update order items if provided
      if (orderItems && orderItems.length > 0) {
        let purchaseRate = 0;
        let totalProfit = 0;
        const updatedOrderItems = [];
  
        for (const item of orderItems) {
          const product = await Product.findById(item.product);
          const updatedOrderItem = {
            product: item.product,
            quantity: item.quantity,
            price: item.price,
            purchaseRate: product.purchaseRate * item.quantity,
            GST: item.GST,
            totalProfit: (product.discountedPrice - product.purchaseRate) * item.quantity,
            finalPriceWithGST: item.finalPriceWithGST,
            discountedPrice: item.discountedPrice,
            userId: order.user,
          };
  
          if (item._id) {
            await OfflineOrderItem.findByIdAndUpdate(item._id, updatedOrderItem);
            updatedOrderItems.push(item._id);
          } else {
            const newOrderItem = new OfflineOrderItem(updatedOrderItem);
            await newOrderItem.save();
            updatedOrderItems.push(newOrderItem._id);
          }
  
          purchaseRate += updatedOrderItem.purchaseRate;
          totalProfit += updatedOrderItem.totalProfit;
        }
  
        order.orderItems = updatedOrderItems;
        order.totalPurchaseRate = purchaseRate;
        order.totalProfit = totalProfit;
      }
  
      // Update the rest of the order fields
      order.Name = BillUser?.name || order.Name;
      order.mobileNumber = BillUser?.mobileNumber || order.mobileNumber;
      order.email = BillUser?.email || order.email;
      order.paymentType = paymentType || order.paymentType;
      order.orderDate = rest.orderDate ? new Date(rest.orderDate) : order.orderDate;
  
      for (const key in rest) {
        if (rest.hasOwnProperty(key)) {
          order[key] = rest[key];
        }
      }
  
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
export {placeOrder, removeItemQuantityOrder, RemoveOneItemOnOrder,getOrderById,updateOrder,cancelledOrder };
