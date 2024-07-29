import express from 'express';
import { createProduct, deleteProduct, updateProduct, viewProducts, viewProduct } from '../controller/product.controller.js';
import { generateOrderWithProductCheck } from '../controller/add.product.js';
import { authenticateToken } from '../middleware/verify.js';
import { importProducts } from '../controller/importExportProduct.js';
import generateRandomBarcode from '../controller/QR-Create.controller.js';

const router = express.Router();

router.post('/create', authenticateToken, createProduct);
router.get('/view/:id', viewProduct);
router.put('/update/:id', authenticateToken, updateProduct);
router.delete('/delete/:id', authenticateToken, deleteProduct);
router.get('/view', viewProducts);
router.post('/purchaseOrder', authenticateToken, generateOrderWithProductCheck);
router.post('/importProducts', importProducts);
router.get('/getBarcode',authenticateToken,generateRandomBarcode);
export default router;
