
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../config/db';
import { z } from 'zod';

const ProfileSchema = z.object({
    full_name: z.string().min(2),
    email: z.string().email(),
    country: z.string().min(2),
    state: z.string().min(2),
    district: z.string().min(2),
    education_level: z.string().min(2),
});

export const updateProfile = async (req: AuthRequest, res: Response) => {
    try {
        const studentId = req.user?.id;
        if (!studentId) return res.status(401).json({ error: 'Unauthorized' });

        const validated = ProfileSchema.parse(req.body);

        const profile = await prisma.studentProfile.upsert({
            where: { student_id: studentId },
            update: { ...validated },
            create: {
                student_id: studentId,
                ...validated
            }
        });

        res.json({ message: 'Profile updated', profile });

    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        res.status(500).json({ error: 'Update Failed' });
    }
};

export const getApprovedColleges = async (req: AuthRequest, res: Response) => {
    try {
        // Strict Filter: Only APPROVED colleges
        const colleges = await prisma.college.findMany({
            where: { status: 'APPROVED' },
            select: {
                id: true,
                name: true,
                address: true,
                academic_details: {
                    select: { courses_offered: true, accreditation: true, intake_capacity: true }
                },
                placement_details: {
                    select: { placement_percentage: true, avg_package: true }
                }
            }
        });
        res.json(colleges);
    } catch (error) {
        res.status(500).json({ error: 'Fetch Failed' });
    }
};

export const getCollegeDetail = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const college = await prisma.college.findUnique({
            where: { id },
            include: {
                academic_details: true,
                faculty: true,
                placement_details: true,
                // Only show verified details to students
            }
        });

        // Security check: Even if they guess ID, ensure it's approved
        if (!college || college.status !== 'APPROVED') {
            return res.status(404).json({ error: 'College not found or not verified.' });
        }

        const { password_hash, ...data } = college;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Fetch Failed' });
    }
};
