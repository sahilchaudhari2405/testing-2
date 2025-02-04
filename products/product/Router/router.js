import express from 'express';
// import QR_Routes from '../routes/qr.route.js'; // Ensure .js extension
import productRouter from '../routes/product.router.js'
import categoryRouter from '../routes/category.routes.js'



const allRouter = express.Router();
allRouter.use('/product', productRouter);
allRouter.use('/category' ,categoryRouter );
export default allRouter;
