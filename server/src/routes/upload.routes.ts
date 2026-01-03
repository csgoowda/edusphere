
import express from 'express';
import { authenticateToken, authorizeRole } from '../middleware/auth';
import { upload } from '../config/multer';
import { uploadFile, getFile } from '../controllers/upload.controller';

const router = express.Router();

router.post('/', authenticateToken, authorizeRole(['COLLEGE']), upload.single('file'), uploadFile);
router.get('/:filename', authenticateToken, getFile);

export default router;
