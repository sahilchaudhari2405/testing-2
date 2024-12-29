import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import TotalCollectionSalesSchema from "../model/total.collection.data.js";
import { getTenantModel } from "../database/getTenantModel.js";


// Function to place an order   
const getTotalSale = asyncHandler(async (req, res) => {
    const tenantId =req.user.tenantId
        const TotalCollectionSales = await getTenantModel(tenantId, "TotalCollectionSales", TotalCollectionSalesSchema );

    const cart = await TotalCollectionSales.find();
    if (!cart) {
        return res.status(404).json(new ApiResponse(404, 'sales not found', null));
    }

        return res.status(200).json(new ApiResponse(200, 'fetch sales successfully', cart));

    }
);
export {getTotalSale}