import express from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/verify.js';
import { addToCart, getCartDetails, getCartItemsById, removeOneCart, removeItemQuantityCart } from '../controller/cart.controller.js';

const cart = express.Router();

cart.post('/addCart', authenticateToken, addToCart);
cart.get('/getCart', authenticateToken, getCartDetails);
cart.get('/getCartById', authenticateToken, getCartItemsById);
cart.get('/removeOneCart', authenticateToken, removeOneCart);
cart.get('/removeItemQuantity', authenticateToken, removeItemQuantityCart);

export default cart;
