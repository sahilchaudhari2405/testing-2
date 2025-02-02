import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import OfflineOrder from "../model/order.model.js";
import offlineOrderSchema from "../model/order.model.js";
import { getTenantModel } from "../database/getTenantModel.js";
import offlineOrderItemSchema from "../model/orderItems.js";
import productSchema from "../model/product.model.js";
import CounterUserSchema from "../model/user.model.js";
import { ClientPurchaseSchema, clientSchema, ClosingBalanceSchema } from "../model/Client.model.js";
// Function to place an order
const getCounterBill = asyncHandler(async (req, res) => {
    const { id ,role} = req.user;
    let cart ;
    const tenantId =req.user.tenantId
    const OfflineOrder = await getTenantModel(tenantId, "OfflineOrder", offlineOrderSchema);
    const OfflineOrderItem = await getTenantModel(tenantId, "OfflineOrderItem",offlineOrderItemSchema);
    const Product = await getTenantModel(tenantId, "Product", productSchema);
    const CounterUser = await getTenantModel(tenantId, "CounterUser", CounterUserSchema);
    const Client = await getTenantModel(tenantId, "Client", clientSchema);
    const ClosingBalance = await getTenantModel(tenantId, "ClosingBalance", ClosingBalanceSchema);
    const ClientPurchase = await getTenantModel(tenantId, "ClientPurchase", ClientPurchaseSchema);
    if(role ==='admin')
    {
      cart  = await OfflineOrder.find().populate('user').populate(
        [
            {
              path: "ClinetID", // Populate the associated client details
              model: "Client",
            },
            {
              path: "orderItems", // Populate order items
              populate: {
                path: "product", // Further populate product details within order items
                model: "Product",
              },
            },
          ]
        );
    }
    else{
      cart  = await OfflineOrder.find({ user: id }).populate('user').populate(

        [
            {
              path: "ClinetID", // Populate the associated client details
              model: "Client",
            },
            {
              path: "orderItems", // Populate order items
              populate: {
                path: "product", // Further populate product details within order items
                model: "Product",
              },
            },
          ]
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
  const Client = await getTenantModel(tenantId, "Client", clientSchema);
  const ClosingBalance = await getTenantModel(tenantId, "ClosingBalance", ClosingBalanceSchema);
  const ClientPurchase = await getTenantModel(tenantId, "ClientPurchase", ClientPurchaseSchema);
    const cart = await OfflineOrder.find().populate(
        [
            {
              path: "ClinetID", // Populate the associated client details
              model: "Client",
            },
            {
              path: "orderItems", // Populate order items
              populate: {
                path: "product", // Further populate product details within order items
                model: "Product",
              },
            },
          ]
    );

    if (!cart) {
        return res.status(404).json(new ApiResponse(404, 'Cart not found', null));
    }

        return res.status(200).json(new ApiResponse(200, 'Order placed successfully', cart));

    }
);



export {getAllBill,getCounterBill};