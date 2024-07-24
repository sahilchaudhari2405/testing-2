import express from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/verify.js';
import { addToCart, getCartDetails, getCartItemsById, removeOneCart, removeItemQuantityCart } from '../controller/add.cart.controller.js';

const cart = express.Router();

cart.post('/addCart', addToCart);
cart.get('/getCart',  getCartDetails);
cart.get('/getCartById', getCartItemsById);
cart.delete('/removeOneCart', removeOneCart);
cart.delete('/removeItemQuantity',  removeItemQuantityCart);
// authenticateToken,

export default cart;
