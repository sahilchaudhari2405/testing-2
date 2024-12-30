import express from 'express';
const AdvancePay = express.Router();


AdvancePay.post('/add-entry/:id',);
AdvancePay.delete('/delete-entry/:id', advancePayController.deleteAdvancePaymentEntry);
AdvancePay.patch('/complete/:id', advancePayController.completeAdvancePayment);
AdvancePay.get('/complete', advancePayController.completeAdvancePayment);
export default  AdvancePay;
