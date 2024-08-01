import express from 'express'
import { authenticateToken } from '../middleware/verify.js';
import  { categories, order, product, PurchaseOrder } from '../controller/test.js';

// Ensure correct path and file name

const deleteModel = express.Router();
deleteModel.delete('/product',product);
deleteModel.delete('/category',categories);
deleteModel.delete('/order',order);
deleteModel.delete('/purchase',PurchaseOrder);
export default deleteModel;
