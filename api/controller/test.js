import Offline_Cart from "../model/cart.model.js";
import OfflineCounterSales from "../model/counter.sales.js";
import OfflineOrder from "../model/order.model.js";
import OfflineOrderItem from "../model/orderItems.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const updateSalesData = async (req,res) => {
    await OfflineOrderItem.collection.drop()
};

export default updateSalesData;
 