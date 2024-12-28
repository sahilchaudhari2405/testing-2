import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import TotalCollectionSales from "../model/total.collection.data.js";
// Function to place an order   
const getTotalSale = asyncHandler(async (req, res) => {


    const cart = await TotalCollectionSales.find();
    if (!cart) {
        return res.status(404).json(new ApiResponse(404, 'sales not found', null));
    }

        return res.status(200).json(new ApiResponse(200, 'fetch sales successfully', cart));

    }
);
export {getTotalSale}