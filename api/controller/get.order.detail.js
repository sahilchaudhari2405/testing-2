import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import OfflineOrder from "../model/order.model.js";
// Function to place an order
const getCounterBill = asyncHandler(async (req, res) => {
    const { id } = req.user;
    const cart = await OfflineOrder.find({ user: id }).populate(
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

        return res.status(200).json(new ApiResponse(200, 'Order placed successfully', cart));

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
export {getAllBill,getCounterBill,getOneBill};