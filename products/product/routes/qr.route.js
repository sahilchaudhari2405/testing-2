import express from 'express'
import generateQR_Code from '../controller/QR-Create.controller';
import { authenticateToken } from '../middleware/verify';
// Ensure correct path and file name

const QR_Routes = express.Router();

QR_Routes.get('/generate',authenticateToken, generateQR_Code);

export default QR_Routes;
