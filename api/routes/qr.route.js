import express from 'express'
import generateQR_Code from '../controller/QR-Create.controller';
// Ensure correct path and file name

const QR_Routes = express.Router();

QR_Routes.get('/generate', generateQR_Code);

export default QR_Routes;
