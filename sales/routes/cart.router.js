import express from 'express';
import { authenticateToken } from '../middleware/verify.js';
import { addToCart, getCartDetails, getCartItemsById, removeOneCart, removeItemQuantityCart, updateToCart, removeAllCart, getCartDetailsOngoing } from '../controller/add.cart.controller.js';

const cart = express.Router();

cart.post('/addCart', authenticateToken, addToCart);
cart.get('/getCart',  authenticateToken, getCartDetails);
cart.get('/getCartById', authenticateToken, getCartItemsById);
cart.delete('/removeOneCart', authenticateToken, removeOneCart);
cart.delete('/removeItemQuantity',  authenticateToken, removeItemQuantityCart);
cart.delete('/removeAllItem',  authenticateToken, removeAllCart);
cart.put('/adjustment',  authenticateToken, updateToCart);
cart.get('/getOnGoing',authenticateToken,getCartDetailsOngoing);
// authenticateToken,

export default cart;
