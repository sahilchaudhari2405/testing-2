import express from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/verify.js';
import { signup, login, logout, refresh, getUsers,updateUser,deleteUser } from '../controller/auth.controller.js';

const auth = express.Router();

auth.post('/signup', signup);
auth.post('/login', login);
auth.post('/logout', logout);
auth.post('/refresh', refresh);
auth.get('/users', authenticateToken, getUsers);
auth.put('/users/update/:id', authenticateToken, updateUser);
auth.put('/users/delete/:id', authenticateToken, deleteUser);

export default auth;
