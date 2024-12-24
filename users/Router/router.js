import express from 'express';
import auth from '../routes/auth.route.js'; 
import userRoutes from '../routes/users.route.js'
import admin from '../routes/admin.route.js';


const allRouter = express.Router();

allRouter.use('/auth', auth);
allRouter.use('/users', userRoutes);
allRouter.use('/admin',admin);
export default allRouter;
