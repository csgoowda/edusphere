import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../config/db';
import * as fs from 'fs';
import * as path from 'path';

const logError = (msg: string, error: any) => {
    const logPath = path.join(__dirname, '../../debug_gov.log');
    const timestamp = new Date().toISOString();
    const errorMessage = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : '';
    fs.appendFileSync(logPath, `[${timestamp}] ${msg}: ${errorMessage}\n${stack}\n\n`);
    console.error(msg, error);
}

// --- COLLEGE MANAGEMENT ---

// 1. Get Pending Colleges
export const getPendingColleges = async (req: AuthRequest, res: Response) => {
    try {
        const colleges = await (prisma.college as any).findMany({
            where: {
                status: { in: ['PENDING', 'CORRECTION_REQUIRED', 'CORRECTION'] },
                is_locked: true
            },
            select: {
                id: true,
                name: true,
                code: true,
                email: true,
                status: true,
                is_locked: true,
                college_type: true,
                country: true,
                state: true,
                district: true,
                principal_name: true,
                address: true,
                updatedAt: true
            },
            orderBy: { name: 'asc' }
        });
        res.json(colleges);
    } catch (error) {
        logError("Failed to fetch pending colleges", error);
        res.status(500).json({ error: 'Failed to fetch colleges' });
    }
};

// 2. Get Approved Colleges (with Auto-Expiry Check)
export const getApprovedColleges = async (req: AuthRequest, res: Response) => {
    try {
        const { country, state, district, type } = req.query;
        const whereClause: any = {
            status: { contains: 'APPROVED', mode: 'insensitive' }
        };

        if (country && country !== '') whereClause.country = { contains: String(country), mode: 'insensitive' };
        if (state && state !== '') whereClause.state = { contains: String(state), mode: 'insensitive' };
        if (district && district !== '') whereClause.district = { contains: String(district), mode: 'insensitive' };
        if (type && type !== '') whereClause.college_type = { contains: String(type), mode: 'insensitive' };

        const colleges = await (prisma.college as any).findMany({
            where: whereClause,
            select: {
                id: true,
                name: true,
                code: true,
                college_type: true,
                country: true,
                state: true,
                district: true,
                approved_at: true,
                valid_until: true,
                approval_status: true,
                status: true
            }
        });

        res.json(colleges);

    } catch (error) {
        logError("Failed to fetch approved colleges", error);
        res.status(500).json({ error: 'Failed to fetch approved colleges' });
    }
};

export const getCollegeFullDetails = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const college = await prisma.college.findUnique({
            where: { id },
            include: {
                academic_details: true,
                faculty: true,
                placement_details: true,
                documents: true,
                verification_logs: {
                    include: { officer: { select: { name: true } } },
                    orderBy: { timestamp: 'desc' }
                }
            }
        });

        if (!college) return res.status(404).json({ error: 'College not found' });

        // Remove password hash
        const { password_hash, ...data } = college;
        res.json(data);
    } catch (error) {
        logError("Failed to fetch details", error);
        res.status(500).json({ error: 'Failed to fetch details' });
    }
};

// 3. Verify / Renew / Revoke
export const verifyCollege = async (req: AuthRequest, res: Response) => {
    try {
        const officerId = req.user?.id;
        const { collegeId, action, remarks } = req.body;

        // Actions: APPROVED, REJECTED, CORRECTION, RENEW, REVOKE

        if (!['APPROVED', 'REJECTED', 'CORRECTION_REQUIRED', 'RENEW', 'REVOKE'].includes(action)) {
            return res.status(400).json({ error: 'Invalid Action' });
        }

        if ((action === 'REJECTED' || action === 'CORRECTION_REQUIRED' || action === 'REVOKE') && !remarks) {
            return res.status(400).json({ error: 'Remarks are mandatory for this action' });
        }

        const now = new Date();
        const sixMonthsLater = new Date();
        sixMonthsLater.setMonth(now.getMonth() + 6);

        // Transaction
        await prisma.$transaction(async (tx: any) => {

            let updateData: any = {
                verified_by: officerId,
                verified_at: now,
                remarks: remarks || null
            };

            if (action === 'APPROVED' || action === 'RENEW') {
                updateData.status = 'APPROVED';
                updateData.is_locked = true;
                updateData.approved_at = now;
                updateData.valid_until = sixMonthsLater;
                updateData.approval_status = 'ACTIVE';
            } else if (action === 'REJECTED') {
                updateData.status = 'REJECTED';
                updateData.is_locked = true;
                updateData.approval_status = 'REJECTED';
            } else if (action === 'REVOKE') {
                updateData.status = 'REJECTED';
                updateData.is_locked = true;
                updateData.approval_status = 'REVOKED';
                updateData.valid_until = now;
            } else if (action === 'CORRECTION_REQUIRED') {
                updateData.status = 'CORRECTION_REQUIRED';
                updateData.is_locked = false; // Unlock
                updateData.approval_status = 'PENDING';
            }

            // 1. Update College
            await tx.college.update({
                where: { id: collegeId },
                data: updateData
            });

            // 2. Create Log Entry
            await tx.verificationLog.create({
                data: {
                    college_id: collegeId,
                    officer_id: officerId!,
                    action: action,
                    remarks: remarks || `${action} Successfully`,
                }
            });
        });

        res.json({ message: `College Action ${action} Completed Successfully` });

    } catch (error) {
        logError("Verification Action Failed", error);
        res.status(500).json({ error: 'Verification Action Failed' });
    }
};

// --- Scholarship Management ---

// --- Scholarship Management ---

export const getScholarships = async (req: AuthRequest, res: Response) => {
    try {
        const scholarships = await prisma.scholarship.findMany();
        res.json(scholarships);
    } catch (error) {
        logError("Get Scholarships Error", error);
        res.status(500).json({ error: 'Failed to fetch scholarships' });
    }
};

export const addScholarship = async (req: AuthRequest, res: Response) => {
    try {
        const { name, amount, eligibility, link } = req.body;
        if (!name || !amount) {
            return res.status(400).json({ error: 'Name and Amount are required' });
        }
        const scholarship = await prisma.scholarship.create({
            data: { name, amount, eligibility, link }
        });
        res.json(scholarship);
    } catch (error) {
        logError("Add Scholarship Error", error);
        res.status(500).json({ error: 'Failed to add scholarship' });
    }
};

export const deleteScholarship = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.scholarship.delete({ where: { id } });
        res.json({ message: 'Scholarship deleted' });
    } catch (error) {
        logError("Delete Scholarship Error", error);
        res.status(500).json({ error: 'Failed to delete scholarship' });
    }
};

export const updateScholarship = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { name, amount, eligibility, link } = req.body;
        const updated = await prisma.scholarship.update({
            where: { id },
            data: { name, amount, eligibility, link }
        });
        res.json(updated);
    } catch (error) {
        logError("Update Scholarship Error", error);
        res.status(500).json({ error: 'Failed to update scholarship' });
    }
};

// --- Trending Courses Management ---

export const getTrendingCourses = async (req: AuthRequest, res: Response) => {
    try {
        const courses = await (prisma as any).trendingCourse.findMany();
        res.json(courses);
    } catch (error) {
        logError("Get Trending Courses Error", error);
        res.status(500).json({ error: 'Failed to fetch trending courses' });
    }
};

export const addTrendingCourse = async (req: AuthRequest, res: Response) => {
    try {
        const { name, category, description } = req.body;
        if (!name || !category) {
            return res.status(400).json({ error: 'Name and Category are required' });
        }
        const course = await (prisma as any).trendingCourse.create({
            data: { name, category, description }
        });
        res.json(course);
    } catch (error) {
        logError("Add Trending Course Error", error);
        res.status(500).json({ error: 'Failed to add trending course' });
    }
};

export const deleteTrendingCourse = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        await (prisma as any).trendingCourse.delete({ where: { id } });
        res.json({ message: 'Trending Course deleted' });
    } catch (error) {
        logError("Delete Trending Course Error", error);
        res.status(500).json({ error: 'Failed to delete trending course' });
    }
};

export const updateTrendingCourse = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { name, category, description } = req.body;
        const updated = await (prisma as any).trendingCourse.update({
            where: { id },
            data: { name, category, description }
        });
        res.json(updated);
    } catch (error) {
        logError("Update Trending Course Error", error);
        res.status(500).json({ error: 'Failed to update trending course' });
    }
};


