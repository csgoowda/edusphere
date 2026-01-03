
import express from 'express';
import { getPublicStats, getTrendingCourses, getScholarships } from '../controllers/public.controller';

const router = express.Router();

router.get('/stats', getPublicStats);
router.get('/trending', getTrendingCourses);
router.get('/scholarships', getScholarships);

export default router;
