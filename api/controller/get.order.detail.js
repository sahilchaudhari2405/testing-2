import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import OfflineOrder from "../model/order.model.js";
import OfflinePurchaseOrder from "../model/purchaseOrder.js"
// Function to place an order
const getCounterBill = asyncHandler(async (req, res) => {
    const { id ,role} = req.user;
    let cart ;
    if(role ==='admin')
    {
      cart  = await OfflineOrder.find().populate('user').populate(

            {
                path:'orderItems',
                populate: {
                    path: 'product',
                    model: 'products'
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
                    model: 'products' 
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
    const cart = await OfflineOrder.findById(id).populate(


        {
            path:'orderItems',
            populate: {
                path: 'product',
                model: 'products'
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
    const cart = await OfflineOrder.find().populate(
        {
            path:'orderItems',
            populate: {
                path: 'product',
                model: 'products'
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
  
    // Add date range filter if fromDate and toDate are provided
    if (fromDate && toDate) {
      query.updatedAt = {
        $gte: new Date(fromDate),
        $lte: new Date(toDate),
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
              model: 'products',
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
                model: 'products',
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
                      model: 'products', 
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
                  model: 'products', 
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

export {getAllBill,getCounterBill,getOneBill,sortOrder};