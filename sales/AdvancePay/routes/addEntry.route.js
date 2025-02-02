import express from 'express';
import { addOrCreateAdvancePaymentEntry, completeAdvancePayment, deleteAdvancePaymentEntry, getAdvancePaymentWithDetails } from '../controller/advancepay.controller.js';
import { authenticateToken } from '../middleware/verify.js';
const AdvancePay = express.Router();

AdvancePay.get("/advance-payment/:id",authenticateToken, getAdvancePaymentWithDetails);

AdvancePay.post('/add-entry',authenticateToken,addOrCreateAdvancePaymentEntry);
AdvancePay.delete('/delete-entry/:id',authenticateToken, deleteAdvancePaymentEntry);
AdvancePay.get('/complete',authenticateToken,completeAdvancePayment);
export default  AdvancePay;
