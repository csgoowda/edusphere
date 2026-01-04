import express from 'express';
import { loginCollege, registerCollege, loginGovernment } from '../controllers/auth.controller';

const router = express.Router();

router.post('/college/register', registerCollege);
router.post('/college/login', loginCollege);
router.post('/gov/login', loginGovernment);

// Student - Moved to student.routes.ts for unified student paths

export default router;
