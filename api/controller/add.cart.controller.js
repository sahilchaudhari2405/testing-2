
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import Product from "../model/product.model.js";
import Offline_CartItem from "../model/cartItem.model.js";
import Offline_Cart from "../model/cart.model.js";
import counter from "../model/user.model.js";

const addToCart = asyncHandler(async (req, res) => {
    const { id } = req.user; 
    // const id=`669b9afa72e1e9138e2a64a3`;
    const { productCode } = req.body; 
    const user = await counter.findById(id); 
    if (!user) {
        return res.status(401).json(new ApiResponse(401, 'User not found', null)); 
    }

    try {
        const product = await Product.findOne({ BarCode: productCode });
        if (!product) {
            return res.status(404).json(new ApiResponse(404, 'Product not found', null)); 
        }

        let cartItem = await Offline_CartItem.findOne({ userId: id, product: product._id });
        console.log(cartItem);

            if(cartItem && cartItem.type=='custom')
            return res.status(404).json(new ApiResponse(404, 'Cart item is custom', null));
        
        if (cartItem) {
            cartItem.quantity += 1;
            cartItem.price += product.price;
            cartItem.discountedPrice += product.discountedPrice;
            cartItem.GST += product.GST;
            cartItem.finalPrice_with_GST += (product.discountedPrice + product.GST);
            cartItem.updatedAt = new Date();
            await cartItem.save();
        } else {
            cartItem = await Offline_CartItem.create({
                quantity: 1,
                price: product.price,
                discountedPrice: product.discountedPrice,
                userId: id,
                GST: product.GST, 
                finalPrice_with_GST: product.discountedPrice + product.GST,
                product: product._id,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            
        }
       product.quantity-=1;
       await product.save();
        let cart = await Offline_Cart.findOne({ userId: id });
        if (!cart) {
            const discount =await Math.max(cartItem.price - cartItem.discountedPrice, 0);
            cart = await Offline_Cart.create({
                userId: id,
                cartItems: [cartItem._id],
                totalPrice: cartItem.price,
                totalItem: 1,
                GST: cartItem.GST, 
                final_price_With_GST: cartItem.finalPrice_with_GST,
                totalDiscountedPrice: cartItem.discountedPrice,
                discount:discount,
            });
            await cart.save();
        } else {
            const discount =await Math.max(product.price - product.discountedPrice, 0);
            if (!cart.cartItems.includes(cartItem._id)) {
                cart.cartItems.push(cartItem._id);
                cart.totalItem +=1;
            }
            cart.GST += product.GST;
            cart.final_price_With_GST +=  product.discountedPrice + product.GST;
            cart.totalPrice += product.price;
            cart.totalDiscountedPrice += product.discountedPrice;
            cart.discount += discount;
            await cart.save();
        } 
        return res.status(200).json(new ApiResponse(200, 'Product added to cart successfully', { cartItem, cart })); 
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message }); 
    }
});


const updateToCart = asyncHandler(async (req, res) => {
    const { id } = req.user; 
    // const id=`669b9afa72e1e9138e2a64a3`;
    const { productCode,discountedPrice,quantity,price,discount,GST,finalPrice_with_GST} = req.body; 
    console.log(req.body);
    const user = await counter.findById(id); 
    if (!user) {
        return res.status(401).json(new ApiResponse(401, 'User not found', null)); 
    }

    try {
        const product = await Product.findOne({ BarCode: productCode });
        if (!product) {
            return res.status(404).json(new ApiResponse(404, 'Product not found', null)); 
        }

        let cartItem = await Offline_CartItem.findOne({ userId: id, product: product._id });
        const oldItem= JSON.parse(JSON.stringify(cartItem)); 
        if (cartItem) {
            cartItem.quantity=0;
            cartItem.price =0;
            cartItem.discountedPrice =0;
            cartItem.GST = 0;
            cartItem.type = 'custom',
            cartItem.finalPrice_with_GST =0;
            cartItem.updatedAt = new Date();
            await cartItem.save();
        }  
       product.quantity+=oldItem.quantity;
       await product.save();
        let cart = await Offline_Cart.findOne({ userId: id });
            // const discount =await Math.max(price - discountedPrice, 0);
            if (!cart.cartItems.includes(cartItem._id)) {
                cart.cartItems.push(cartItem._id);
                cart.totalItem += 1;
            }
            const discounted =await Math.max(oldItem.price - oldItem.discountedPrice, 0);
            cart.GST-=oldItem.GST,
            cart.final_price_With_GST-=oldItem.finalPrice_with_GST;
            cart.totalPrice-=oldItem.price;
            cart.totalDiscountedPrice-=oldItem.discountedPrice
            cart.discount-=discounted;
            product.quantity-=quantity;
            await product.save();
            console.log(cart);
            await cart.save();
            if (cartItem) {
                cartItem.quantity = quantity;
                cartItem.price = price*quantity;
                cartItem.discountedPrice = discountedPrice*quantity;
                cartItem.GST = GST*quantity;
                cartItem.type = 'custom';
                cartItem.finalPrice_with_GST = finalPrice_with_GST;
                cartItem.updatedAt = new Date();  
                await cartItem.save();
            }
            cart.GST += cartItem.GST;
            cart.final_price_With_GST += cartItem.finalPrice_with_GST;
            cart.totalPrice += cartItem.price;
            cart.totalDiscountedPrice += cartItem.discountedPrice;
            cart.discount += discount;
                                
            console.log('Updated Cart:', cart);
        
            await cart.save();
        return res.status(200).json(new ApiResponse(200, 'custom Product added to cart successfully', { cartItem, cart })); 
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message }); 
    }
});
const getCartDetails = asyncHandler(async (req, res) => {
    const { id } = req.user;
    // const id=`669b9afa72e1e9138e2a64a3`;
      console.log(id);
    if (!id) {
        return res.status(401).json(new ApiResponse(401, 'User ID not provided in cookies', null));
    }

    const user = await counter.findById(id);

    if (!user) {
        return res.status(401).json(new ApiResponse(401, 'User not found', null));
    }

    try {
        const cart = await Offline_Cart.findOne({ userId: id }).populate({
            path: 'cartItems',
            populate: {
                path: 'product',
                model: 'products'
            }
        });

        if (!cart) {
            return res.status(404).json(new ApiResponse(404, 'Cart is empty for this user', null));
        }

        return res.status(200).json(new ApiResponse(200, 'Cart retrieved successfully', cart));
    } catch (error) {
        console.error(error);
        return res.status(500).json(new ApiResponse(500, error.message, null));
    }
});

const getCartItemsById = asyncHandler(async (req, res) => {
    const { id } = req.user; 
    const { productQR } = req.query;

    const user = await counter.findById(id);

    if (!user) {
        return res.status(401).json(new ApiError(401, 'User not found'));
    }

    try {
        const product = await Product.findOne({ BarCode: productQR });

        if (!product) {
            return res.status(404).json(new ApiResponse(404, 'Product not found', null));
        }

        return res.status(200).json(new ApiResponse(200, 'Cart item retrieved successfully', product));
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

const removeOneCart = asyncHandler(async (req, res) => {
    const { id } = req.user; 
    // const id=`669b9afa72e1e9138e2a64a3`;
    const { itemId } = req.query;

    const user = await counter.findById(id);

    if (!user) {
        return res.status(401).json(new ApiError(401, 'User not found'));
    }

    try {
  

        const cartItem = await Offline_CartItem.findById({ _id: itemId });

        if (!cartItem) {        
            return res.status(404).json(new ApiResponse(404, 'Cart item not found', null));
        } else {
            if (cartItem.userId.toString() !== id) {
                return res.status(403).json(new ApiResponse(403, 'Unauthorized to delete this cart item', null));
            }
        }
        const product = await Product.findById(cartItem.product);
        if (!product) {
            return res.status(404).json(new ApiResponse(404, 'Product not found', null)); 
        }
        let cart = await Offline_Cart.findOne({ userId: id });
        const cartItemExists = cart.cartItems.some(item => item.toString() === cartItem._id.toString());
        if (cartItem.quantity > 0 && cartItemExists) { 
            const discount = await Math.max(cartItem.price - cartItem.discountedPrice, 0);
            cart.cartItems.pull(cartItem._id);
            cart.totalPrice -= cartItem.price;
            cart.totalItem -= 1;
            cart.totalDiscountedPrice -= cartItem.discountedPrice;
            cart.GST -= cartItem.GST;
            cart.final_price_With_GST -= cartItem.finalPrice_with_GST;
            cart.discount -= discount;
            await cart.save();
            product.quantity+=cartItem.quantity,
            await product.save();
            await Offline_CartItem.findOneAndDelete({ _id: itemId });
        }

        return res.status(200).json(new ApiResponse(200, 'Cart item deleted successfully', cartItem));
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

const removeAllCart = asyncHandler(async (req, res) => {
    const { id } = req.user; 
    // const id=`669b9afa72e1e9138e2a64a3`;
    const user = await counter.findById(id);
    if (!user) {
        return res.status(401).json(new ApiError(401, 'User not found'));
    }

    try {
        const cart = await Offline_Cart.findOne({ userId: id });
        if (!cart) {
            return res.status(404).json(new ApiResponse(404, 'Cart not found'));
        }

        await Offline_CartItem.deleteMany({ _id: { $in: cart.cartItems } });
        await Offline_Cart.findOneAndDelete({ userId: id });

        return res.status(200).json(new ApiResponse(200, 'Cart deleted successfully'));
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

const removeItemQuantityCart = asyncHandler(async (req, res) => {
    const { id } = req.user; 
    // const id=`669b9afa72e1e9138e2a64a3`
    const { itemId } = req.query;
    console.log(itemId)

    const user = await counter.findById(id);

    if (!user) {
        return res.status(401).json(new ApiError(401, 'User not found'));
    }
    
    try {
        const cartItem = await Offline_CartItem.findById({ _id: itemId });
        
        if (!cartItem) {
            return res.status(404).json(new ApiResponse(404, 'Cart item not found', null));
        } else {
            if (cartItem.userId.toString() !== id) {
                return res.status(403).json(new ApiResponse(403, 'Unauthorized to delete this cart item', null));
            }
        }
        if (cartItem.type=='custom') {
            return res.status(404).json(new ApiResponse(404, 'Cart item is custom', null));
        }
        const productId = cartItem.product;
        const product = await Product.findById({ _id: productId });
        if (cartItem.quantity > 1) {
            cartItem.quantity -= 1;
            cartItem.price -= product.price;
            cartItem.GST -= product.GST;
            cartItem.finalPrice_with_GST -= (product.discountedPrice + product.GST);
            cartItem.discountedPrice -= product.discountedPrice;
            cartItem.updatedAt = new Date();
            await cartItem.save();
            product.quantity+=1;
            await product.save();
            let cart = await Offline_Cart.findOne({ userId: id });
            const cartItemExists = cart.cartItems.some(item => item.toString() === cartItem._id.toString());
            if (cart && cartItemExists) {
                const discount =await Math.max(product.price - product.discountedPrice, 0);
                cart.totalPrice -= product.price;
                cart.GST -= product.GST;
                cart.final_price_With_GST -= (product.discountedPrice + product.GST);
                cart.totalDiscountedPrice -= product.discountedPrice;
                cart.discount -= discount;
                await cart.save();
            }

            return res.status(200).json(new ApiResponse(200, 'Cart item quantity decreased successfully', cartItem));
        } else {
            return res.status(400).json(new ApiResponse(400, 'Minimum quantity reached for this item', null));
        } 
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

export {
    addToCart,
    getCartDetails,
    getCartItemsById,
    removeOneCart,
    removeAllCart,
    removeItemQuantityCart,
    updateToCart,
};