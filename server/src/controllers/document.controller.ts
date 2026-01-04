
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../config/db';
import path from 'path';
import fs from 'fs';

export const getDocument = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params; // Document ID (UUID)
        const user = req.user;

        if (!user) return res.status(401).json({ error: 'Unauthorized' });

        // Fetch Document Metadata
        const doc = await prisma.document.findUnique({
            where: { id },
            include: { college: true }
        });

        if (!doc) {
            return res.status(404).json({ error: 'Document not found' });
        }

        // Authorization Logic
        let allowed = false;

        // 1. Government Officer - Can view ALL documents
        if (user.role === 'GOV') {
            allowed = true;
        }
        // 2. College - Can view OWN documents
        else if (user.role === 'COLLEGE' && doc.college_id === user.id) {
            allowed = true;
        }
        // 3. Student - Can view only if College is APPROVED and ACTIVE
        else if (user.role === 'STUDENT') {
            const college = doc.college as any;
            if (college.status === 'APPROVED' && college.approval_status === 'ACTIVE') {
                allowed = true;
            }
        }

        if (!allowed) {
            return res.status(403).json({ error: 'Access Denied' });
        }

        // Helper to extract filename from URL (assuming stored as /uploads/filename.ext or similar)
        // Adjust logic based on how you save file_url in upload.controller.ts
        // Current upload logic: `/uploads/${req.file.filename}`
        const filename = path.basename(doc.file_url);
        const filePath = path.join(__dirname, '../../uploads', filename);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'File on disk not found' });
        }

        // Set Headers for Correct Display
        // PDF -> inline (preview)
        // Image -> inline
        // Others -> attachment?
        const ext = path.extname(filename).toLowerCase();
        let contentType = 'application/octet-stream';

        if (ext === '.pdf') contentType = 'application/pdf';
        else if (['.jpg', '.jpeg', '.png'].includes(ext)) contentType = `image/${ext.substring(1)}`;

        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', `inline; filename="${filename}"`); // inline usually forces browser to try opening

        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);

    } catch (error) {
        console.error("Document Fetch Error:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
