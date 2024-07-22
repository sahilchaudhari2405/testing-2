import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import OfflineCounterSales from "../model/counter.sales.js";
import TotalOfflineSales from "../model/total.offline.sales.js";
// Function to place an order
const getTotalOfflineSale = asyncHandler(async (req, res) => {
    const { id } = req.user;
    const cart = await TotalOfflineSales.find();

    if (!cart) {
        return res.status(404).json(new ApiResponse(404, 'sales not found', null));
    }

        return res.status(200).json(new ApiResponse(200, 'fetch sales successfully', cart));

    }
);
export {getTotalOfflineSale}