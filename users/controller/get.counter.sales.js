import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import OfflineCounterSales from "../model/counter.sales.js";
import { getTenantModel } from "../database/getTenantModel.js";
import offlineCounterSalesSchema from "../model/counter.sales.js";
// Function to place an order
const getCounterSale = asyncHandler(async (req, res) => {
    const { id } = req.user;
    const tenantId =req.user.tenantId
    const OfflineCounterSales = await getTenantModel(tenantId, "OfflineCounterSales", offlineCounterSalesSchema);
    const cart = await OfflineCounterSales.findOne({ user: id }).populate('user');

    if (!cart) {
        return res.status(404).json(new ApiResponse(404, 'counter not found', null));
    }

        return res.status(200).json(new ApiResponse(200, 'fetch sales successfully', cart));

    }
);
const getAllCounterSale = asyncHandler(async (req, res) => {
    const tenantId =req.user.tenantId
    const OfflineCounterSales = await getTenantModel(tenantId, "OfflineCounterSales", offlineCounterSalesSchema);
    const cart = await OfflineCounterSales.find().populate('user');

    if (!cart) {
        return res.status(404).json(new ApiResponse(404, 'counter not found', null));
    }

        return res.status(200).json(new ApiResponse(200, 'fetch sales successfully', cart));

    }
);
export {getCounterSale,getAllCounterSale}