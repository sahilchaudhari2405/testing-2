import express from 'express';
import { authenticateToken } from '../middleware/verify.js';
import { placeOrder, removeItemQuantityOrder, RemoveOneItemOnOrder } from '../controller/create.and.edit.order.controller.js';
import { getAllBill, getCounterBill, getOneBill } from '../controller/get.order.detail.js';
import { getCounterSale } from '../controller/get.counter.sales.js';

const OrderRouter = express.Router();

OrderRouter.post('/placeOrder', authenticateToken, placeOrder);
OrderRouter.put('/RemoveOneItem', authenticateToken, RemoveOneItemOnOrder);
OrderRouter.put('/RemoveOneQuantity', authenticateToken, removeItemQuantityOrder);
OrderRouter.get('/getAllOrderByCounter', authenticateToken,getCounterBill );
OrderRouter.get('/getCounterSales', authenticateToken,getCounterSale);
OrderRouter.get('/getCounterSales', authenticateToken,getCounterSale);
OrderRouter.get('/getCounterOrder', authenticateToken,getCounterBill);
OrderRouter.get('/getEditOrder', authenticateToken,getOneBill);
export default OrderRouter;
