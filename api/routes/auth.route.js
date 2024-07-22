import express from 'express';
import { authenticateToken, authorizeRoles, checkAdmin } from '../middleware/verify.js';
import { signup, login, logout, refresh, getUsers } from '../controller/auth.controller.js';

const auth = express.Router();

auth.post('/signup',checkAdmin, authenticateToken, signup);
auth.post('/login', login);
auth.post('/logout', logout);
auth.post('/refresh', refresh);
auth.get('/users', authenticateToken, getUsers);
export default auth;
