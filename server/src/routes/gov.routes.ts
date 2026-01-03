
import express from 'express';
import { authenticateToken, authorizeRole } from '../middleware/auth';
import { getPendingColleges, getCollegeFullDetails, verifyCollege } from '../controllers/gov.controller';

const router = express.Router();

// Middleware applied to all routes in this router
// router.use(authenticateToken, authorizeRole(['GOV']));

// router.get('/colleges', getPendingColleges);
// router.get('/colleges/:id', getCollegeFullDetails);
// router.post('/verify', verifyCollege);

// Scholarships
import { getScholarships, addScholarship, deleteScholarship, updateScholarship, getTrendingCourses, addTrendingCourse, deleteTrendingCourse, updateTrendingCourse } from '../controllers/gov.controller';
router.get('/scholarships', getScholarships);
router.post('/scholarships', addScholarship);
router.put('/scholarships/:id', updateScholarship);
router.delete('/scholarships/:id', deleteScholarship);

// Trending Courses
router.get('/trending-courses', getTrendingCourses);
router.post('/trending-courses', addTrendingCourse);
router.put('/trending-courses/:id', updateTrendingCourse);
router.delete('/trending-courses/:id', deleteTrendingCourse);

export default router;
