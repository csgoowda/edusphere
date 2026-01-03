import express from 'express';
import { loginCollege, registerCollege, loginGovernment, loginStudent } from '../controllers/auth.controller';

const router = express.Router();

router.post('/college/register', registerCollege);
router.post('/college/login', loginCollege);
router.post('/gov/login', loginGovernment);

// Student
router.post('/student/login', loginStudent);

export default router;
