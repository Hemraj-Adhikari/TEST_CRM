import express from 'express';
import { auth } from '../middleware/auth.middleware.js';
import { getLeads, createLead, updateLead, deleteLead } from '../controllers/leads.controller.js';

const router = express.Router();

router.use(auth);
router.get('/', getLeads);
router.post('/', createLead);
router.put('/:id', updateLead);
router.delete('/:id', deleteLead);

export default router;
