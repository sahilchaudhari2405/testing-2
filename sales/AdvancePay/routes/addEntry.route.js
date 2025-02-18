import express from 'express';
import { addOrCreateAdvancePaymentEntry, completeAdvancePayment, deleteAdvancePaymentEntry, getAdvancePaymentWithDetails } from '../controller/advancepay.controller.js';
import { authenticateToken } from '../middleware/verify.js';
import { reduceClientBalanceAndLoyalty } from '../controller/reduceClientBalanceAndLoyalty.js';
const AdvancePay = express.Router();

AdvancePay.get("/advance-payment/:id",authenticateToken, getAdvancePaymentWithDetails);

AdvancePay.post('/add-entry',authenticateToken,addOrCreateAdvancePaymentEntry);
AdvancePay.delete('/delete-entry/:id',authenticateToken, deleteAdvancePaymentEntry);
AdvancePay.get('/complete',authenticateToken,completeAdvancePayment);
AdvancePay.post('/UpdateAmount',authenticateToken,reduceClientBalanceAndLoyalty);
export default  AdvancePay;
