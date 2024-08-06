import express from 'express';
import { authenticateToken } from '../middleware/verify.js';
import { addToCart, getCartDetails, getCartItemsById, removeOneCart, removeItemQuantityCart, updateToCart } from '../controller/add.cart.controller.js';

const cart = express.Router();

cart.post('/addCart', authenticateToken, addToCart);
cart.get('/getCart',  authenticateToken, getCartDetails);
cart.get('/getCartById', authenticateToken, getCartItemsById);
cart.delete('/removeOneCart', authenticateToken, removeOneCart);
cart.delete('/removeItemQuantity',  authenticateToken, removeItemQuantityCart);
cart.put('/adjustment',  authenticateToken, updateToCart);
// authenticateToken,

export default cart;
