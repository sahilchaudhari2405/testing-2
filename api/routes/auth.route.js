import express from 'express';
import { authenticateToken,  checkAdmin } from '../middleware/verify.js';
import { signup, login, logout, refresh, getUsers, updateUser, deleteUser } from '../controller/auth.controller.js';

const auth = express.Router();

auth.post('/signup',authenticateToken , checkAdmin, signup);
auth.post('/login', login);
auth.post('/logout', logout);
auth.post('/refresh', refresh);
auth.get('/users', authenticateToken, checkAdmin, getUsers); // Only admin can access
auth.put('/users/update/:id', authenticateToken, checkAdmin, updateUser); // Only admin can update
auth.delete('/users/delete/:id', authenticateToken, checkAdmin, deleteUser); // Only admin can delete

export default auth;
