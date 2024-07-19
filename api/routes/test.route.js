import express from 'express'
import updateSalesData from '../controller/test.js';
import { authenticateToken } from '../middleware/verify.js';


const test = express.Router();

test.post('/check',authenticateToken, updateSalesData);

export default test;
 