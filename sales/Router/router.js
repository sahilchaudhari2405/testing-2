import express from 'express';
import OrderRouter from '../routes/Order.route.js'; // Ensure .js extension
import cart from '../routes/cart.router.js'; // Ensure .js extension



const allRouter = express.Router();


allRouter.use('/order', OrderRouter);
allRouter.use('/cart', cart);


export default allRouter;
