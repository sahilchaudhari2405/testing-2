import express from 'express';
import { authenticateToken } from '../middleware/verify.js';
import { createUser, viewUser, viewUsers, updateUser, deleteUser } from '../controller/users.controller.js';

const route = express.Router();

route.post('/createUser', createUser);
route.get('/viewUser/:id', viewUser);
route.get('/viewUsers', viewUsers);
route.put('/updateUser/:id', updateUser);
route.delete('/deleteUser/:id', deleteUser);

export default route;
