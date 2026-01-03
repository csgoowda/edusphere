
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';

export const uploadFile = (req: AuthRequest, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const fileUrl = `/uploads/${req.file.filename}`;
        res.json({ message: 'File uploaded successfully', fileUrl });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Upload failed' });
    }
};

import path from 'path';
import fs from 'fs';

export const getFile = (req: AuthRequest, res: Response) => {
    try {
        const { filename } = req.params;
        const filePath = path.join(__dirname, '../../uploads', filename);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'File not found' });
        }

        res.sendFile(filePath);
    } catch (error) {
        res.status(500).json({ error: 'File fetch failed' });
    }
};
