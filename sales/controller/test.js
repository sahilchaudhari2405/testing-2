
import Category from "../model/category.model.js";
import OfflineCounterSales from "../model/counter.sales.js";
import OfflineOrder from "../model/order.model.js";
import OfflineOrderItem from "../model/orderItems.js";
import Product from "../model/product.model.js";
import OfflinePurchaseOrder from "../model/purchaseOrder.js";
import TotalCollectionSales from "../model/total.collection.data.js";
import TotalOfflineSales from "../model/total.offline.sales.js";
import { ApiResponse } from "../utils/ApiResponse.js";
 

const product = async (req,res) => {
    await Product.collection.drop() 
    return res.status(200).json(new ApiResponse(200, 'deleted successfully'));
};
const categories = async (req,res) => {
    await Category.collection.drop()
    return res.status(200).json(new ApiResponse(200, 'deleted successfully'));
};

const counterSale = async (req,res) => {
    await Product.collection.drop()
    return res.status(200).json(new ApiResponse(200, 'deleted successfully'));
};
const  order = async (req,res) => {
    await OfflineOrder.collection.drop()
    await OfflineOrderItem.collection.drop();
    await OfflineCounterSales.collection.drop();
    await TotalOfflineSales.collection.drop();
    await TotalCollectionSales.collection.drop();
    return res.status(200).json(new ApiResponse(200, 'deleted successfully'));
};

const orderItem = async (req,res) => {
    await Product.collection.drop()
    return res.status(200).json(new ApiResponse(200, 'deleted successfully'));
};
const PurchaseOrder = async (req,res) => {
    await OfflinePurchaseOrder.collection.drop()
    return res.status(200).json(new ApiResponse(200, 'deleted successfully'));
};

export {product,categories,counterSale,order,orderItem,PurchaseOrder};
