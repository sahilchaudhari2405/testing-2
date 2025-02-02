import express from 'express';
import multer from 'multer';
import { createInvoiceSettings,  updateInvoiceSettings, deleteInvoiceSettings, getInvoiceSettings } from '../controller/setting.controller.js';
import { authenticateToken } from '../middleware/verify.js';

const Settingsrouter = express.Router();

// Set up multer for handling logo upload
const upload = multer({ dest: 'uploads/' });

// Route for creating invoice settings
Settingsrouter.post('/create',authenticateToken, createInvoiceSettings);

// Route for getting invoice settings by ID
Settingsrouter.get('/',authenticateToken, getInvoiceSettings);

// Route for updating invoice settings by ID
Settingsrouter.put('/:id',authenticateToken, updateInvoiceSettings);

// Route for deleting invoice settings by ID
Settingsrouter.delete('/:id',authenticateToken, deleteInvoiceSettings);

export default Settingsrouter;
