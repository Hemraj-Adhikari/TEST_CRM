import express from 'express';
import { auth } from '../middleware/auth.middleware.js';
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from '../controllers/customers.controller.js';

const router = express.Router();

router.use(auth);
router.get('/', getCustomers);
router.post('/', createCustomer);
router.put('/:id', updateCustomer);
router.delete('/:id', deleteCustomer);

export default router;
