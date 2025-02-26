import express from 'express';
import { createProduct, deleteProduct, updateProduct, viewProducts, viewProduct,sortProducts, SuggestProduct,sortProductsfordescription, getProducts, deleteAllProduct } from '../controller/product.controller.js';
import { generateOrderWithProductCheck } from '../controller/add.product.js';
import { authenticateToken } from '../middleware/verify.js';
import { importProducts } from '../controller/importExportProduct.js';
import generateRandomBarcode from '../controller/QR-Create.controller.js';

const router = express.Router();

router.post('/create', authenticateToken, createProduct);
router.get('/view/:id', authenticateToken, viewProduct);
router.put('/update/:id', authenticateToken, updateProduct);
router.delete('/delete/:id', authenticateToken, deleteProduct);
router.post('/view',authenticateToken, getProducts);
router.post('/sortProducts',authenticateToken, sortProducts);
router.post('/sortProductsfordescription',authenticateToken, sortProductsfordescription);
router.delete('/deleteAll',authenticateToken,deleteAllProduct)
router.get('/SuggestProduct',authenticateToken, SuggestProduct);
router.post('/purchaseOrder', authenticateToken, generateOrderWithProductCheck);
router.post('/importProducts',authenticateToken, importProducts);
router.get('/getBarcode',authenticateToken,generateRandomBarcode);
export default router;
