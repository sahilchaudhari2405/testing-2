import express from 'express';
import { cancelOrder, getAllOrders, placeOrder } from '../controller/order.controller.js';
import { authenticateToken } from '../middleware/verify.js';

const OrderRouter = express.Router();

OrderRouter.post('/placeOrder', authenticateToken, placeOrder);

OrderRouter.get('/cancelOrder', authenticateToken, cancelOrder);

OrderRouter.get('/getAllOrders', authenticateToken, getAllOrders);

export default OrderRouter;
