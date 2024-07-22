import Offline_Cart from "../model/cart.model.js";
import OfflineCounterSales from "../model/counter.sales.js";
import OfflineOrder from "../model/order.model.js";

import OfflineOrderItem from "../model/orderItems.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const test = async (req,res) => {
    await OfflineOrder.collection.drop()
    return res.status(200).json(new ApiResponse(200, 'deleted successfully'));
};

export default test;
 