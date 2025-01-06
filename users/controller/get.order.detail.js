import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import OfflineOrder from "../model/order.model.js";
import offlineOrderSchema from "../model/order.model.js";
import { getTenantModel } from "../database/getTenantModel.js";
import offlineOrderItemSchema from "../model/orderItems.js";
import productSchema from "../model/product.model.js";
import CounterUserSchema from "../model/user.model.js";
// Function to place an order
const getCounterBill = asyncHandler(async (req, res) => {
    const { id ,role} = req.user;
    let cart ;
    const tenantId =req.user.tenantId
    const OfflineOrder = await getTenantModel(tenantId, "OfflineOrder", offlineOrderSchema);
    const OfflineOrderItem = await getTenantModel(tenantId, "OfflineOrderItem",offlineOrderItemSchema);
    const Product = await getTenantModel(tenantId, "Product", productSchema);
    const CounterUser = await getTenantModel(tenantId, "CounterUser", CounterUserSchema);

    if(role ==='admin')
    {
      cart  = await OfflineOrder.find().populate('user').populate(

            {
                path:'orderItems',
                populate: {
                    path: 'product',
                    model: 'Product'
                }
            }
        );
    }
    else{
      cart  = await OfflineOrder.find({ user: id }).populate('user').populate(

            {
                path:'orderItems',
                populate: {
                    path: 'product',
                    model: 'Product' 
                }
            }
        );
    }

    if (!cart) {
        return res.status(404).json(new ApiResponse(404, 'Cart not found', null));
    }

        return res.status(200).json(new ApiResponse(200, 'Order placed successfully', cart));

    }
);

const getAllBill = asyncHandler(async (req, res) => {

  const tenantId =req.user.tenantId
  const OfflineOrder = await getTenantModel(tenantId, "OfflineOrder", offlineOrderSchema);
  const OfflineOrderItem = await getTenantModel(tenantId, "OfflineOrderItem",offlineOrderItemSchema);
  const Product = await getTenantModel(tenantId, "Product", productSchema);
    const cart = await OfflineOrder.find().populate(
        {
            path:'orderItems',
            populate: {
                path: 'product',
                model: 'Product'
            }
        }
    );

    if (!cart) {
        return res.status(404).json(new ApiResponse(404, 'Cart not found', null));
    }

        return res.status(200).json(new ApiResponse(200, 'Order placed successfully', cart));

    }
);



export {getAllBill,getCounterBill};