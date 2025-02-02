import { getTenantModel } from "../database/getTenantModel.js";
import offlineOrderItemSchema from "../model/orderItems.js";
import productSchema from "../model/product.model.js";
import offlinePurchaseOrderSchema from "../model/purchaseOrder.js";

export const GetPurchaseOrder = async (req, res) => {
    const {id ,role} =req.user;
    const tenantId =req.user.tenantId
    const OfflinePurchaseOrder = await getTenantModel(tenantId, "OfflinePurchaseOrder",offlinePurchaseOrderSchema );

    const Product = await getTenantModel(tenantId, "Product", productSchema);
    if(role==='admin')
    {
        const results = await OfflinePurchaseOrder.find().populate('user').populate({
            path: 'orderItems.productId',
            model: 'Product'
        });
        res.status(201).json({ message: "Order created successfully", order: results });
    }
    else{
        const results = await OfflinePurchaseOrder.find({user:id}).populate('user').populate({
            path: 'orderItems.productId',
            model: 'Product'
        });
        res.status(201).json({ message: "Order created successfully", order: results });
    }
};