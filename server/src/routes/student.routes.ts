
import express from 'express';
import { authenticateToken, authorizeRole } from '../middleware/auth';
import { updateProfile, getApprovedColleges, getCollegeDetail } from '../controllers/student.controller';

const router = express.Router();

router.use(authenticateToken, authorizeRole(['STUDENT']));

router.post('/profile', updateProfile);
router.get('/colleges', getApprovedColleges);
router.get('/colleges/:id', getCollegeDetail);

export default router;
