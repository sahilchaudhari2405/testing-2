import express from 'express';
// import { verifyAdmin } from '../middleware/verifyAdmin.js';
//import upload from '../cloud/multerConfig.js'; // Correctly import multer configuration
import { createProduct, deleteProduct, updateProduct, viewProducts, viewProduct } from '../controller/product.controller.js';
import { generateOrderWithProductCheck } from '../controller/add.product.js';
import { authenticateToken } from '../middleware/verify.js';

const router = express.Router();
// console.log("hallo")
// upload.single('image')
router.post('/create', createProduct);
router.get('/view/:id', viewProduct);
router.put('/update/:id', updateProduct);
router.delete('/delete/:id',deleteProduct);
router.get('/view', viewProducts);
router.post('/purchaseOrder',authenticateToken, generateOrderWithProductCheck);
export default router;