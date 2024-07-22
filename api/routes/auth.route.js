import express from 'express';
import { authenticateToken, authorizeRoles, checkAdmin } from '../middleware/verify.js';
import { signup, login, logout, refresh, getUsers, updateUser, deleteUser } from '../controller/auth.controller.js';

const auth = express.Router();

auth.post('/signup',authenticateToken, authorizeRoles('admin'), signup);
auth.post('/login', login);
auth.post('/logout', logout);
auth.post('/refresh', refresh);
auth.get('/users', authenticateToken, authorizeRoles('admin'), getUsers); // Only admin can access
auth.put('/users/update/:id', authenticateToken, authorizeRoles('admin'), updateUser); // Only admin can update
auth.delete('/users/delete/:id', authenticateToken, authorizeRoles('admin'), deleteUser); // Only admin can delete

export default auth;
