import express from 'express';
import {authenticateToken} from '../middleware/verify.js';
import { createCategory, deleteCategory, updateCategory, viewCategories, viewCategory } from '../controller/category.controller.js';

const router = express.Router();

router.post('/create', authenticateToken, createCategory);
router.get('/view/:id', viewCategory);
router.put('/update/:id', authenticateToken, updateCategory);
router.delete('/delete/:id', authenticateToken, deleteCategory);
router.get('/view', viewCategories);

export default router;
