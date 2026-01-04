
import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { getDocument } from '../controllers/document.controller';

const router = express.Router();

// GET /api/documents/:id
router.get('/:id', authenticateToken, getDocument);

export default router;
