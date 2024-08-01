import express from 'express'
import { authenticateToken } from '../middleware/verify.js';
import test from '../controller/test.js';
// Ensure correct path and file name

const QR_Routes = express.Router();

QR_Routes.delete('/check',authenticateToken,test );

export default QR_Routes;
