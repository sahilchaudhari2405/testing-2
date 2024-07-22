import express from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/verify.js';
import { addToCart, getCartDetails, getCartItemsById, removeOneCart, removeItemQuantityCart } from '../controller/add.cart.controller.js';

const cart = express.Router();

cart.post('/addCart', authenticateToken, addToCart);
cart.get('/getCart', authenticateToken, getCartDetails);
cart.get('/getCartById', authenticateToken, getCartItemsById);
cart.delete('/removeOneCart', authenticateToken, removeOneCart);
cart.delete('/removeItemQuantity', authenticateToken, removeItemQuantityCart);

export default cart;
