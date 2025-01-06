import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import CounterUserSchema from "../model/user.model.js";
import { getTenantModel } from "../database/getTenantModel.js";
import productSchema from "../model/product.model.js";
import Offline_cartItemSchema from "../model/cartItem.model.js";
import Offline_cartSchema from "../model/cart.model.js";
import AdvancePaySchema from "../model/advancePay.js";
import createProduct from "../utils/productCreate.js";

const addToCart = asyncHandler(async (req, res) => {
  let { id } = req.user;
  // const id=`669b9afa72e1e9138e2a64a3`;
  const { productCode, status,PayId,uId,formData } = req.body;
  id= (uId===id && uId)? uId:id;
  const tenantId = req.user.tenantId;
  const CounterUser = await getTenantModel(
    tenantId,
    "CounterUser",
    CounterUserSchema
  );
  const Product = await getTenantModel(tenantId, "Product", productSchema);
  const Offline_CartItem = await getTenantModel(
    tenantId,
    "Offline_CartItem",
    Offline_cartItemSchema
  );
  const Offline_Cart = await getTenantModel(
    tenantId,
    "Offline_Cart",
    Offline_cartSchema
  );
  const user = await CounterUser.findById(id);
  if (!user) {
    return res.status(401).json(new ApiResponse(401, "User not found", null));
  }

  try {
    let product;
    if (!productCode) {
      // If no productCode is provided, create a new product
      product = await createProduct(formData, tenantId);
    } else {
      // Try to find the product with the given productCode
      product = await Product.findOne({ BarCode: productCode });
  
      if (!product) {
        // If product is not found, return a 404 response
        return res.status(404).json(new ApiResponse(404, "Product not found", null));
      }
    }
    let cartItem = await Offline_CartItem.findOne({
      PayId: PayId || undefined,
      status:'OnGoing',
      userId: id ,
      product: product._id,
    });
    console.log(cartItem);
    if (cartItem) {
      cartItem.quantity += 1;
      cartItem.price += product.price;
      cartItem.discountedPrice += cartItem.OneUnit;
      cartItem.GST += product.GST;
      cartItem.finalPrice_with_GST += cartItem.OneUnit + product.GST;
      cartItem.updatedAt = new Date();
      await cartItem.save();
    } else {
      cartItem = await Offline_CartItem.create({
        quantity: 1,
        price: product.price,
        discountedPrice: product.discountedPrice,
        userId: id,
        status: "OnGoing",
        PayId: PayId || undefined,
        OneUnit: product.discountedPrice,
        GST: product.GST,
        finalPrice_with_GST: product.discountedPrice + product.GST,
        product: product._id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    product.quantity -= 1;
    await product.save();
    let value = 0;
    if (product.price != 0 && product.price) {
      value = product.price - cartItem.OneUnit;
    } else {
      value = product.discountedPrice - cartItem.OneUnit;
    }
    let cart = await Offline_Cart.findOne({ userId: id ,PayId: PayId || undefined,status: "OnGoing"});
    if (!cart) {
      cart = await Offline_Cart.create({
        userId: id,
        cartItems: [cartItem._id],
        totalPrice: cartItem.price,
        PayId: PayId || undefined,
        totalItem: 1,
        status: "OnGoing",
        GST: cartItem.GST,
        final_price_With_GST: cartItem.finalPrice_with_GST,
        totalDiscountedPrice: cartItem.discountedPrice,
        discount: value,
      });
      await cart.save();
    } else {
      if (!cart.cartItems.includes(cartItem._id)) {
        cart.cartItems.push(cartItem._id);
        cart.totalItem += 1;
      }
      cart.GST += product.GST;
      cart.final_price_With_GST += cartItem.OneUnit + product.GST;
      cart.totalPrice += product.price;
      cart.totalDiscountedPrice += cartItem.OneUnit;
      cart.discount += value;
      await cart.save();
    }
    return res
      .status(200)
      .json(
        new ApiResponse(200, "Product added to cart successfully", {
          cartItem,
          cart,
        })
      );
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

const updateToCart = asyncHandler(async (req, res) => {
  let { id } = req.user;
  // const id=`669b9afa72e1e9138e2a64a3`;
  const {
    productCode,
    discountedPrice,
    quantity,
    price,
    discount,
    GST,
    finalPrice_with_GST,
    OneUnit,
    uId,
    PayId
  } = req.body;
  id= (uId===id && uId)? uId:id;
  console.log(req.body);
  const tenantId = req.user.tenantId;
  const CounterUser = await getTenantModel(
    tenantId,
    "CounterUser",
    CounterUserSchema
  );
  const Product = await getTenantModel(tenantId, "Product", productSchema);
  const Offline_CartItem = await getTenantModel(
    tenantId,
    "Offline_CartItem",
    Offline_cartItemSchema
  );
  const Offline_Cart = await getTenantModel(
    tenantId,
    "Offline_Cart",
    Offline_cartSchema
  );
  const user = await CounterUser.findById(id);
  if (!user) {
    return res.status(401).json(new ApiResponse(401, "User not found", null));
  }

  try {
    const product = await Product.findOne({ BarCode: productCode });
    if (!product) {
      return res
        .status(404)
        .json(new ApiResponse(404, "Product not found", null));
    }

    let cartItem = await Offline_CartItem.findOne({
      PayId: PayId || undefined,
      status:'OnGoing',
      userId: id,
      product: product._id,
    });
    const oldItem = JSON.parse(JSON.stringify(cartItem));
    if (cartItem) {
      cartItem.quantity = 0;
      cartItem.price = 0;
      cartItem.discountedPrice = 0;
      cartItem.GST = 0;
      cartItem.OneUnit = 0;
      (cartItem.type = "custom"), (cartItem.finalPrice_with_GST = 0);
      cartItem.updatedAt = new Date();
      await cartItem.save();
    }
    product.quantity += oldItem.quantity;
    await product.save();
    let cart = await Offline_Cart.findOne({ userId: id ,PayId: PayId || undefined,status: "OnGoing"});
    // const discount =await Math.max(price - discountedPrice, 0);
    if (!cart.cartItems.includes(cartItem._id)) {
      cart.cartItems.push(cartItem._id);
      cart.totalItem += 1;
    }
    let value = 0;
    if (product.price != 0 && product.price) {
      value = product.price - oldItem.OneUnit;
    } else {
      value = product.discountedPrice - oldItem.OneUnit;
    }
    (cart.GST -= oldItem.GST),
      (cart.final_price_With_GST -= oldItem.finalPrice_with_GST);
    cart.totalPrice -= oldItem.price;
    cart.totalDiscountedPrice -= oldItem.discountedPrice;
    cart.discount -= value * oldItem.quantity;
    product.quantity -= quantity;
    await product.save();
    console.log(cart);
    await cart.save();
    if (cartItem) {
      cartItem.quantity = quantity;
      cartItem.price = product.price * quantity;
      (cartItem.OneUnit = OneUnit),
        (cartItem.discountedPrice = discountedPrice);
      cartItem.GST = GST * quantity;
      cartItem.type = "custom";
      cartItem.finalPrice_with_GST = finalPrice_with_GST;
      cartItem.updatedAt = new Date();
      await cartItem.save();
    }
    cart.GST += cartItem.GST;
    cart.final_price_With_GST += cartItem.finalPrice_with_GST;
    cart.totalPrice += cartItem.price;
    cart.totalDiscountedPrice += cartItem.discountedPrice;
    cart.discount += discount;

    console.log("Updated Cart:", cart);

    await cart.save();
    return res
      .status(200)
      .json(
        new ApiResponse(200, "custom Product added to cart successfully", {
          cartItem,
          cart,
        })
      );
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
});
const getCartDetails = asyncHandler(async (req, res) => {
  let { id } = req.user;
  // const id=`669b9afa72e1e9138e2a64a3`;
  const { PayId, uId } = req.query;
  id= (uId===id && uId)? uId:id;
  const tenantId = req.user.tenantId;
  const Offline_Cart = await getTenantModel(
    tenantId,
    "Offline_Cart",
    Offline_cartSchema
  );
  const Product = await getTenantModel(tenantId, "Product", productSchema);
  const Offline_CartItem = await getTenantModel(
    tenantId,
    "Offline_CartItem",
    Offline_cartItemSchema
  );
  const CounterUser = await getTenantModel(
    tenantId,
    "CounterUser",
    CounterUserSchema
  );

  console.log(id);

  if (!id) {
    return res
      .status(401)
      .json(new ApiResponse(401, "User ID not provided in cookies", null));
  }

  const user = await CounterUser.findById(id);

  if (!user) {
    return res.status(401).json(new ApiResponse(401, "User not found", null));
  }

  try {
    const cart = await Offline_Cart.findOne({
      userId: id,
      status: "OnGoing",
      PayId: PayId || undefined,
    }).populate({
      path: "cartItems",
      populate: {
        path: "product",
        model: "Product",
      },
    });
    if (!cart) {
      return res
        .status(404)
        .json(new ApiResponse(404, "Cart is empty for this user", null));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "Cart retrieved successfully", cart));
  } catch (error) {
    console.error(error);
    return res.status(500).json(new ApiResponse(500, error.message, null));
  }
});
const getCartDetailsOngoing = asyncHandler(async (req, res) => {
  let { id } = req.user;
  // const id=`669b9afa72e1e9138e2a64a3`;
  const { PayId,uId } = req.query;
  id= (uId===id && uId)? uId:id;
  const tenantId = req.user.tenantId;
  const Offline_Cart = await getTenantModel(
    tenantId,
    "Offline_Cart",
    Offline_cartSchema
  );
  const Product = await getTenantModel(tenantId, "Product", productSchema);
  const Offline_CartItem = await getTenantModel(
    tenantId,
    "Offline_CartItem",
    Offline_cartItemSchema
  );
  const CounterUser = await getTenantModel(
    tenantId,
    "CounterUser",
    CounterUserSchema
  );
  const AdvancePay = await getTenantModel(
    tenantId,
    "AdvancePay",
    AdvancePaySchema
  );



  if (!id) {
    return res
      .status(401)
      .json(new ApiResponse(401, "User ID not provided in cookies", null));
  }

  const user = await CounterUser.findById(id);

  if (!user) {
    return res.status(401).json(new ApiResponse(401, "User not found", null));
  }

  try {
    const cart = await Offline_Cart.findOne({
      PayId: PayId || undefined,
      userId: id,
      status: "OnGoing",
    }).populate({
      path: "cartItems",
      populate: {
        path: "product",
        model: "Product",
      },
    });

    if (!cart) {
      return res
        .status(404)
        .json(new ApiResponse(404, "Cart is empty for this user", null));
    }
    return res
      .status(200)
      .json(new ApiResponse(200, "Cart retrieved successfully", cart));
  } catch (error) {
    console.error(error);
    return res.status(500).json(new ApiResponse(500, error.message, null));
  }
});
const getCartItemsById = asyncHandler(async (req, res) => {
  let { id } = req.user;
  const { productQR } = req.query;
  const { PayId, uId } = req.query;
  id= (uId===id && uId)? uId:id;
  const tenantId = req.user.tenantId;
  const CounterUser = await getTenantModel(
    tenantId,
    "CounterUser",
    CounterUserSchema
  );
  const Product = await getTenantModel(tenantId, "Product", productSchema);
  const user = await CounterUser.findById(id);

  if (!user) {
    return res.status(401).json(new ApiError(401, "User not found"));
  }

  try {
    const product = await Product.findOne({ BarCode: productQR });

    if (!product) {
      return res
        .status(404)
        .json(new ApiResponse(404, "Product not found", null));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "Cart item retrieved successfully", product));
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

const removeOneCart = asyncHandler(async (req, res) => {
  let { id } = req.user;
  // const id=`669b9afa72e1e9138e2a64a3`;

  const {itemId, PayId, uId } = req.query;
  console.log(req.query)
  const tenantId = req.user.tenantId;
  id= (uId===id && uId)? uId:id;
  const CounterUser = await getTenantModel(
    tenantId,
    "CounterUser",
    CounterUserSchema
  );
  const Product = await getTenantModel(tenantId, "Product", productSchema);
  const Offline_CartItem = await getTenantModel(
    tenantId,
    "Offline_CartItem",
    Offline_cartItemSchema
  );
  const Offline_Cart = await getTenantModel(
    tenantId,
    "Offline_Cart",
    Offline_cartSchema
  );
  const user = await CounterUser.findById(id);

  if (!user) {
    return res.status(401).json(new ApiError(401, "User not found"));
  }

  try {
    const cartItem = await Offline_CartItem.findById(itemId);

    if (!cartItem) {
      return res
        .status(404)
        .json(new ApiResponse(404, "Cart item not found", null));
    } else {
      if (cartItem.userId.toString() !== id) {
        return res
          .status(403)
          .json(
            new ApiResponse(403, "Unauthorized to delete this cart item", null)
          );
      }
    }
    const product = await Product.findById(cartItem.product);
    if (!product) {
      return res
        .status(404)
        .json(new ApiResponse(404, "Product not found", null));
    }
    let cart = await Offline_Cart.findOne({ userId: id ,PayId: PayId || undefined,status: "OnGoing"});
    const cartItemExists = cart.cartItems.some(
      (item) => item.toString() === cartItem._id.toString()
    );
    if (cartItem.quantity > 0 && cartItemExists) {
      let value = 0;
      if (product.price != 0 && product.price) {
        value = product.price - cartItem.OneUnit;
      } else {
        value = product.discountedPrice - cartItem.OneUnit;
      }
      cart.cartItems.pull(cartItem._id);
      cart.totalPrice -= cartItem.price;
      cart.totalItem -= 1;
      cart.totalDiscountedPrice -= cartItem.discountedPrice;
      cart.GST -= cartItem.GST;
      cart.final_price_With_GST -= cartItem.finalPrice_with_GST;
      cart.discount -= value * cartItem.quantity;
      await cart.save();
      (product.quantity += cartItem.quantity), await product.save();
      await Offline_CartItem.findOneAndDelete({ _id: itemId });
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "Cart item deleted successfully", cartItem));
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

const removeAllCart = asyncHandler(async (req, res) => {
  let { id } = req.user;
  // const id=`669b9afa72e1e9138e2a64a3`;
  const { PayId, uId } = req.query;
  id= (uId===id && uId)? uId:id;
  const tenantId = req.user.tenantId;
  const CounterUser = await getTenantModel(
    tenantId,
    "CounterUser",
    CounterUserSchema
  );
  const Offline_CartItem = await getTenantModel(
    tenantId,
    "Offline_CartItem",
    Offline_cartItemSchema
  );
  const Offline_Cart = await getTenantModel(
    tenantId,
    "Offline_Cart",
    Offline_cartSchema
  );
  const user = await CounterUser.findById(id);
  if (!user) {
    return res.status(401).json(new ApiError(401, "User not found"));
  }

  try {
    const cart = await Offline_Cart.findOne({ userId: id,PayId: PayId || undefined, status: "OnGoing"});
    console.log(cart)
    if (!cart) {
      return res.status(404).json(new ApiResponse(404, "Cart not found"));
    }

    await Offline_CartItem.deleteMany({ _id: { $in: cart.cartItems } });
    await Offline_Cart.findOneAndDelete({ userId: id,PayId: PayId || undefined, status: "OnGoing"});

    return res
      .status(200)
      .json(new ApiResponse(200, "Cart deleted successfully"));
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

const removeItemQuantityCart = asyncHandler(async (req, res) => {
  let { id } = req.user;
  // const id=`669b9afa72e1e9138e2a64a3`
  const { PayId, uId } = req.query;
  const { itemId } = req.query;
  id= (uId===id && uId)? uId:id;
  console.log(itemId);
  const tenantId = req.user.tenantId;
  const CounterUser = await getTenantModel(
    tenantId,
    "CounterUser",
    CounterUserSchema
  );
  const Product = await getTenantModel(tenantId, "Product", productSchema);
  const Offline_CartItem = await getTenantModel(
    tenantId,
    "Offline_CartItem",
    Offline_cartItemSchema
  );
  const Offline_Cart = await getTenantModel(
    tenantId,
    "Offline_Cart",
    Offline_cartSchema
  );
  const user = await CounterUser.findById(id);

  if (!user) {
    return res.status(401).json(new ApiError(401, "User not found"));
  }

  try {
    const cartItem = await Offline_CartItem.findById(itemId);

    if (!cartItem) {
      return res
        .status(404)
        .json(new ApiResponse(404, "Cart item not found", null));
    } else {
      if (cartItem.userId.toString() !== id) {
        return res
          .status(403)
          .json(
            new ApiResponse(403, "Unauthorized to delete this cart item", null)
          );
      } 
    }

    const productId = cartItem.product;
    const product = await Product.findById({ _id: productId });
    if (cartItem.quantity > 1) {
      cartItem.quantity -= 1;
      cartItem.price -= product.price;
      cartItem.GST -= product.GST;
      cartItem.finalPrice_with_GST -= cartItem.OneUnit + product.GST;
      cartItem.discountedPrice -= cartItem.OneUnit;
      cartItem.updatedAt = new Date();
      await cartItem.save();
      product.quantity += 1;
      await product.save();
      let cart = await Offline_Cart.findOne({ userId: id,PayId: PayId || undefined,status: "OnGoing" });
      const cartItemExists = cart.cartItems.some(
        (item) => item.toString() === cartItem._id.toString()
      );
      if (cart && cartItemExists) {
        let value = 0;
        if (product.price != 0 && product.price) {
          value = product.price - cartItem.OneUnit;
        } else {
          value = product.discountedPrice - cartItem.OneUnit;
        }
        cart.totalPrice -= product.price;
        cart.GST -= product.GST;
        cart.final_price_With_GST -= cartItem.OneUnit + product.GST;
        cart.totalDiscountedPrice -= cartItem.OneUnit;
        cart.discount -= value;
        await cart.save();
      }

      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            "Cart item quantity decreased successfully",
            cartItem
          )
        );
    } else {
      return res
        .status(400)
        .json(
          new ApiResponse(400, "Minimum quantity reached for this item", null)
        );
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
  getCartDetailsOngoing,
};
