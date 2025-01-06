import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import { getTenantModel } from "../database/getTenantModel.js";
import offlineOrderSchema from "../model/order.model.js";
import offlinePurchaseOrderSchema from "../model/purchaseOrder.js";
import offlineOrderItemSchema from "../model/orderItems.js";
import productSchema from "../model/product.model.js";
import CounterUserSchema from "../model/user.model.js";
// Function to place an order
const getCounterBill = asyncHandler(async (req, res) => {
    const { id ,role} = req.user;
    let cart ;
    const tenantId =req.user.tenantId
    const OfflineOrder = await getTenantModel(tenantId, "OfflineOrder", offlineOrderSchema);
        const Product = await getTenantModel(tenantId, "Product", productSchema);
        const OfflineOrderItem = await getTenantModel(tenantId, "OfflineOrderItem",offlineOrderItemSchema);

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
const getOneBill = asyncHandler(async (req, res) => {
    const { id } = req.query;
    const tenantId =req.user.tenantId
    const OfflineOrder = await getTenantModel(tenantId, "OfflineOrder", offlineOrderSchema);
    const Product = await getTenantModel(tenantId, "Product", productSchema);
    const OfflineOrderItem = await getTenantModel(tenantId, "OfflineOrderItem",offlineOrderItemSchema);

    const cart = await OfflineOrder.findById(id).populate(


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

        return res.status(200).json(new ApiResponse(200, 'Order retreived successfully', cart));

    }
);

const getAllBill = asyncHandler(async (req, res) => {
  const tenantId =req.user.tenantId
  const OfflineOrder = await getTenantModel(tenantId, "OfflineOrder", offlineOrderSchema);
  const Product = await getTenantModel(tenantId, "Product", productSchema);
  const OfflineOrderItem = await getTenantModel(tenantId, "OfflineOrderItem",offlineOrderItemSchema);

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

const sortOrder = asyncHandler(async (req, res) => {
    const { fromDate, toDate, name,type } = req.body;
    const { id ,role} = req.user;
  
    let query = {};
    const tenantId =req.user.tenantId
    const OfflineOrder = await getTenantModel(tenantId, "OfflineOrder", offlineOrderSchema);
    const OfflinePurchaseOrder = await getTenantModel(tenantId, "OfflinePurchaseOrder",offlinePurchaseOrderSchema );
    const Product = await getTenantModel(tenantId, "Product", productSchema);
    const OfflineOrderItem = await getTenantModel(tenantId, "OfflineOrderItem",offlineOrderItemSchema);
    const CounterUser = await getTenantModel(tenantId, "CounterUser", CounterUserSchema);

    // Add date range filter if fromDate and toDate are provided
    if (fromDate && toDate) {
      query.updatedAt = {
        $gte: new Date(fromDate),
        $lte: new Date(toDate),
      };
    }

    if ((fromDate && toDate) && (fromDate === toDate))  {
      query.updatedAt = {
        $gte: new Date(fromDate),
      };
    }
  
    // Add name filter if provided
    if (name) {
        query.Name = { $regex: name, $options: 'i' }; // 'i' for case-insensitive
      }
    console.log(role)



  
      if(type=='Purchase'){
        try {
            
  
          if(role=='admin'){
            const orders = await OfflinePurchaseOrder.find(query)
            .populate({
              path: 'user',
              model: 'CounterUser',
            })
            .populate({
              path: 'orderItems.productId',
              model: 'Product',
            })
            .sort({ date: -1 }); // Change 'date' to the appropriate field if necessary
        
          console.log(orders, "hallo");
          res.json(orders);
          }else{
            query = { user: id };
            const orders = await OfflinePurchaseOrder.find(query)
              .populate({
                path: 'user',
                model: 'CounterUser',
              })
              .populate({
                path: 'orderItems.productId',
                model: 'Product',
              })
              .sort({ date: -1 }); // Change 'date' to the appropriate field if necessary
          
            console.log(orders, "hallo");
            res.json(orders);
          }

          } catch (err) {
            res.status(500).json({ error: 'Internal server error' });
          }
      }else{
        try {
            
          if(role=='admin'){
            const orders = await OfflineOrder.find(query)
              .populate(
                  {
                path: 'user',
                model: 'CounterUser',
              }).populate(
              {
                  path: 'orderItems',
                  populate: {
                      path: 'product',
                      model: 'Product', 
                  },
              }
          )
              .sort({ date: -1 }); // Change 'date' to the appropriate field if necessary
        
            res.json(orders);
        }else{
          query = { user: id };
          const orders = await OfflineOrder.find(query)
          .populate(
              {
            path: 'user',
            model: 'CounterUser',
          }).populate(
          {
              path: 'orderItems',
              populate: {
                  path: 'product',
                  model: 'Product', 
              },
          }
      )
          .sort({ date: -1 }); // Change 'date' to the appropriate field if necessary
    
        res.json(orders);
        }
          } catch (err) {
            res.status(500).json({ error: 'Internal server error' });
          }
      }

  });

const searchOfflineOrders = async (req, res) => {
    const { alphabet, number } = req.body;
  
    try {
      const tenantId =req.user.tenantId
      const OfflineOrder = await getTenantModel(tenantId, "OfflineOrder", offlineOrderSchema);
      let matchCriteria = {};
  
      // Build the match criteria based on the provided alphabet
      if (alphabet) {
        matchCriteria.Name = { $regex: `^${alphabet}`, $options: 'i' }; // Match Name starting with the alphabet
      }
  
      // Aggregate pipeline to match and group the records
      const distinctOrders = await OfflineOrder.aggregate([
        {
          $addFields: {
            mobileNumberStr: { $toString: "$mobileNumber" }, // Convert mobileNumber to string
          },
        },
        {
          $match: {
            ...matchCriteria,
            mobileNumberStr: number ? { $regex: `${number}` } : { $exists: true }, // Match mobileNumber containing the digit
          },
        },
        {
          $group: {
            _id: "$mobileNumber", // Group by mobileNumber to ensure distinct entries
            Name: { $first: "$Name" },
            mobileNumber: { $first: "$mobileNumber" },
            email: { $first: "$email" },
          },
        },
      ]);
  
      return res.status(200).send({
        message: "Distinct orders retrieved successfully",
        status: true,
        data: distinctOrders,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        message: "Internal server error",
        status: false,
        error: error.message,
      });
    }
  };

export {getAllBill,getCounterBill,getOneBill,sortOrder,searchOfflineOrders};