import express from 'express';
import { authenticateToken } from '../middleware/verify.js';
import { addToCart, getCartDetails, getCartItemsById, removeOneCart, removeItemQuantityCart, updateToCart, removeAllCart, getCartDetailsOngoing } from '../controller/add.OnGoing.controller.js';

const OnGoingCart = express.Router();

OnGoingCart.post('/addCart', authenticateToken, addToCart);
OnGoingCart.get('/getCart',  authenticateToken, getCartDetails);
OnGoingCart.get('/getCartById', authenticateToken, getCartItemsById);
OnGoingCart.delete('/removeOneCart', authenticateToken, removeOneCart);
OnGoingCart.delete('/removeItemQuantity',  authenticateToken, removeItemQuantityCart);
OnGoingCart.delete('/removeAllItem',  authenticateToken, removeAllCart);
OnGoingCart.put('/adjustment',  authenticateToken, updateToCart);
OnGoingCart.get('/getOnGoing',authenticateToken,getCartDetailsOngoing);
// authenticateToken,

export default OnGoingCart;
