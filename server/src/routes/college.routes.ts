import express from 'express';
import { authenticateToken, authorizeRole } from '../middleware/auth';
import { getCollegeDetails, submitCollegeData } from '../controllers/college.controller';

const router = express.Router();

// Get Current College Details
router.get('/me', authenticateToken, authorizeRole(['COLLEGE']), getCollegeDetails);

// Submit Data
router.post('/submit', authenticateToken, authorizeRole(['COLLEGE']), submitCollegeData);

export default router;
