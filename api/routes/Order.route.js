import express from 'express';
import { authenticateToken } from '../middleware/verify.js';
import { getAllBill, getCounterBill,getOneBill,sortOrder } from '../controller/get.order.detail.js';
import { placeOrder, removeItemQuantityOrder, RemoveOneItemOnOrder,getOrderById,updateOrder, cancelledOrder } from '../controller/create.and.edit.order.controller.js';
import { getCounterSale,getAllCounterSale } from '../controller/get.counter.sales.js';

const OrderRouter = express.Router();

OrderRouter.post('/placeOrder', authenticateToken,placeOrder);
OrderRouter.put('/RemoveOneItem', authenticateToken, RemoveOneItemOnOrder);
OrderRouter.put('/RemoveOneQuantity', authenticateToken, removeItemQuantityOrder);
OrderRouter.get('/getAllOrderByCounter',getAllCounterSale );
OrderRouter.get('/getCounterSales', authenticateToken,getCounterSale);
OrderRouter.get('/getCounterOrder', authenticateToken,getCounterBill);
OrderRouter.get('/getEditOrder', authenticateToken,getOneBill);
OrderRouter.post('/sortOrder', authenticateToken,sortOrder);
// OrderRouter.get('/getCounterOrder', authenticateToken,getCounterBill);

OrderRouter.get('/getCounterOrder', authenticateToken,getCounterBill);
OrderRouter.get('/getCounterOrderbyID/:id',getOrderById);
OrderRouter.put('/updateOrderbyID/:id',updateOrder);
OrderRouter.put('/cancelOrder',authenticateToken,cancelledOrder);

export default OrderRouter;
