import express from 'express';
// import QR_Routes from '../routes/qr.route.js'; // Ensure .js extension
import auth from '../routes/auth.route.js'; // Ensure .js extension
import OrderRouter from '../routes/Order.route.js'; // Ensure .js extension
import cart from '../routes/cart.router.js'; // Ensure .js extension
import productRouter from '../routes/product.router.js'
import categoryRouter from '../routes/category.routes.js'
import { importProducts } from '../controller/importExportProduct.js';
import userRoutes from '../routes/users.route.js'
import admin from '../routes/admin.route.js';
import QR_Routes from '../routes/test.route.js';


const allRouter = express.Router();

allRouter.use('/auth', auth);
// allRouter.use('/OR', QR_Routes);
allRouter.use('/order', OrderRouter);
allRouter.use('/cart', cart);
allRouter.use('/users', userRoutes);
allRouter.use('/product', productRouter);
allRouter.use('/category' ,categoryRouter );
allRouter.use('/admin',admin);
allRouter.use('/test',QR_Routes);
allRouter.use('/import',importProducts);
export default allRouter;
