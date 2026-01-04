import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../config/db';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'gov_edusphere_secret_key_2026';


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

// --- Student Auth (OTP Flow) ---

const StudentLoginSchema = z.object({
    mobile: z.string().min(10).max(15).regex(/^[0-9]+$/, "Mobile number must be digits only"),
    otp: z.string().optional()
});

/**
 * PUBLIC: Send OTP to student mobile
 * Accepts { mobile: string }
 */
export const sendOtp = async (req: Request, res: Response) => {
    try {
        console.log("[STUDENT_AUTH] sendOtp called with:", req.body);
        const { mobile } = StudentLoginSchema.parse(req.body);

        // Safe Upsert: Ensure student exists
        const student = await prisma.student.upsert({
            where: { phone: mobile },
            update: {},
            create: { phone: mobile }
        });

        const mockOtp = '1234';
        const otpHash = await bcrypt.hash(mockOtp, 10);

        await prisma.student.update({
            where: { id: student.id },
            data: {
                otp_hash: otpHash,
                otp_expires_at: new Date(Date.now() + 10 * 60 * 1000)
            }
        });

        console.log(`[STUDENT_AUTH] OTP Generated for ${mobile}: ${mockOtp}`);
        res.json({
            success: true,
            message: 'OTP sent successfully',
            mockOtp,
            step: 'VERIFY_OTP'
        });
    } catch (error: any) {
        console.error("[STUDENT_AUTH] sendOtp Error:", error);
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Validation failed', details: error.errors });
        }
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
};

/**
 * PUBLIC: Verify OTP and return JWT
 * Accepts { mobile: string, otp: string }
 */
export const verifyOtp = async (req: Request, res: Response) => {
    try {
        const { mobile, otp } = req.body;
        if (!mobile || !otp) return res.status(400).json({ error: 'Mobile and OTP are required' });

        const student = await prisma.student.findUnique({
            where: { phone: mobile },
            include: { profile: true }
        });

        if (!student || !student.otp_hash || !student.otp_expires_at) {
            return res.status(400).json({ error: 'No OTP requested for this number' });
        }

        if (new Date() > student.otp_expires_at) {
            return res.status(400).json({ error: 'OTP has expired' });
        }

        const validOtp = await bcrypt.compare(otp, student.otp_hash);
        if (!validOtp) return res.status(400).json({ error: 'Invalid OTP' });

        // Clear OTP after success
        await prisma.student.update({
            where: { id: student.id },
            data: { otp_hash: null, otp_expires_at: null }
        });

        const token = jwt.sign(
            { id: student.id, role: 'STUDENT' },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            token,
            profileComplete: !!student.profile,
            user: {
                id: student.id,
                phone: student.phone,
                role: 'STUDENT',
                name: student.profile?.full_name || 'Student'
            }
        });
    } catch (error: any) {
        console.error("[STUDENT_AUTH] verifyOtp Error:", error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
};

