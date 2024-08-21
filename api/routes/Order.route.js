import express from 'express';
import { authenticateToken, checkAdmin } from '../middleware/verify.js';
import { getAllBill, getCounterBill,getOneBill,sortOrder, searchOfflineOrders } from '../controller/get.order.detail.js';
import { placeOrder, removeItemQuantityOrder, RemoveOneItemOnOrder,getOrderById,updateOrder, cancelledOrder } from '../controller/create.and.edit.order.controller.js';
import { getCounterSale,getAllCounterSale } from '../controller/get.counter.sales.js';

const OrderRouter = express.Router();

OrderRouter.post('/placeOrder', authenticateToken,placeOrder);
OrderRouter.put('/RemoveOneItem', authenticateToken, RemoveOneItemOnOrder);
OrderRouter.put('/RemoveOneQuantity', authenticateToken, removeItemQuantityOrder);
OrderRouter.get('/getAllCounterSales',authenticateToken,checkAdmin, getAllCounterSale );
OrderRouter.get('/getCounterOrder', authenticateToken,getCounterBill); 
OrderRouter.get('/getEditOrder', authenticateToken,getOneBill);
OrderRouter.post('/sortOrder', authenticateToken,sortOrder);
OrderRouter.post('/searchOfflineOrders',searchOfflineOrders);
// OrderRouter.get('/getCounterOrder', authenticateToken,getCounterBill);
    
OrderRouter.get('/getCounterOrderbyID/:id',getOrderById);
OrderRouter.put('/updateOrderbyID/:id',updateOrder); 
OrderRouter.put('/cancelOrder',authenticateToken,cancelledOrder);
OrderRouter.put('/decreaseQuantity',authenticateToken,removeItemQuantityOrder);


export default OrderRouter;
