import express from 'express';
import { authenticateToken, authorizeRole } from '../middleware/auth';
import { updateProfile, getApprovedColleges, getCollegeDetail, sendOtp, verifyOtp } from '../controllers/student.controller';

const router = express.Router();

// Public Authentication Routes (No JWT required)
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);

// Protected Student Routes (requires 'STUDENT' role)
router.post('/profile', authenticateToken, authorizeRole(['STUDENT']), updateProfile);
router.get('/colleges', authenticateToken, authorizeRole(['STUDENT']), getApprovedColleges);
router.get('/colleges/:id', authenticateToken, authorizeRole(['STUDENT']), getCollegeDetail);

export default router;
