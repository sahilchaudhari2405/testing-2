import express from 'express'
import generateQR_Code from '../controller/QR-Create.controller';
import { authenticateToken } from '../middleware/verify';
import test from '../controller/test';
// Ensure correct path and file name

const QR_Routes = express.Router();

QR_Routes.get('/check',authenticateToken, );

export default test;
