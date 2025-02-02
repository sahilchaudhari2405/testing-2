import express from 'express';
import OrderRouter from '../routes/Order.route.js'; // Ensure .js extension
import cart from '../routes/cart.router.js'; // Ensure .js extension
import AdvancePay from '../routes/addEntry.route.js';
import OnGoingCart from '../routes/OnGoing.route.js';



const allRouter = express.Router();


allRouter.use('/order', OrderRouter);
allRouter.use('/cart', cart);
allRouter.use('/OnGoing',OnGoingCart)
allRouter.use('/AdvancePay',AdvancePay);

export default allRouter;
