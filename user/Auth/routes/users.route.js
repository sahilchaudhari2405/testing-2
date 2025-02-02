import express from 'express';
import { authenticateToken } from '../middleware/verify.js';
import { createUser, viewUser, viewUsers, updateUser, deleteUser } from '../controller/users.controller.js';

const route = express.Router();

route.post('/createUser',authenticateToken, createUser);
route.get('/viewUser/:id',authenticateToken, viewUser);
route.get('/viewUsers',authenticateToken, viewUsers);
route.put('/updateUser/:id',authenticateToken, updateUser);
route.delete('/deleteUser/:id',authenticateToken, deleteUser);

export default route;
