import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import OfflineCounterSales from "../model/counter.sales.js";
import TotalCollectionSales from "../model/total.collection.data.js";
// Function to place an order
const getTotalOfflineSale = asyncHandler(async (req, res) => {
    const { id,role } = req.user;
    let cart = [];
    if(role ==='admin')
    {
       cart  = await TotalCollectionSales.find();
    }
    else{
         cart =  await OfflineCounterSales.findOne({ user: id }).populate('user');
    }
    if (!cart) {
        return res.status(404).json(new ApiResponse(404, 'sales not found', null));
    }

        return res.status(200).json(new ApiResponse(200, 'fetch sales successfully', cart));

    }
);
export {getTotalOfflineSale}