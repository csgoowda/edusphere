
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '../config/db';

const JWT_SECRET = process.env.JWT_SECRET || 'gov_edusphere_secret_key_2026';

// Validation Schemas
const RegisterSchema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6),
    code: z.string().min(3), // College Code
    address: z.string().min(5),
    principal_name: z.string().min(3),
    principal_phone: z.string().min(10),
});

const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export const registerCollege = async (req: Request, res: Response) => {
    try {
        const validated = RegisterSchema.parse(req.body);

        // Check uniqueness
        const existing = await prisma.college.findFirst({
            where: {
                OR: [{ email: validated.email }, { code: validated.code }]
            }
        });

        if (existing) {
            return res.status(400).json({ error: 'College with this Email or Code already exists.' });
        }

        const hashedPassword = await bcrypt.hash(validated.password, 10);

        const college = await prisma.college.create({
            data: {
                name: validated.name,
                email: validated.email,
                password_hash: hashedPassword,
                code: validated.code,
                address: validated.address,
                principal_name: validated.principal_name,
                principal_phone: validated.principal_phone,
                status: 'PENDING',
                is_locked: false
            }
        });

        const token = jwt.sign({ id: college.id, role: 'COLLEGE' }, JWT_SECRET, { expiresIn: '8h' });

        res.status(201).json({
            message: 'Registration successful',
            token,
            user: { id: college.id, name: college.name, email: college.email, role: 'COLLEGE' }
        });

    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const loginCollege = async (req: Request, res: Response) => {
    try {
        const { email, password } = LoginSchema.parse(req.body);

        const college = await prisma.college.findUnique({ where: { email } });
        if (!college) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, college.password_hash);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: college.id, role: 'COLLEGE' }, JWT_SECRET, { expiresIn: '8h' });

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: college.id,
                name: college.name,
                email: college.email,
                role: 'COLLEGE',
                status: college.status,
                is_locked: college.is_locked
            }
        });

    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const loginGovernment = async (req: Request, res: Response) => {
    try {
        const { employee_id, password } = req.body;

        if (!employee_id || !password) {
            return res.status(400).json({ error: 'Employee ID and Password are required' });
        }

        const officer = await prisma.governmentUser.findUnique({
            where: { employee_id }
        });

        if (!officer) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, officer.password_hash);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: officer.id, role: 'GOV' },
            JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: officer.id,
                name: officer.name,
                role: 'GOV'
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// --- Student Auth (Mock OTP) ---

export const loginStudent = async (req: Request, res: Response) => {
    try {
        const { phone, otp } = req.body;

        if (!phone) {
            return res.status(400).json({ error: 'Phone number is required' });
        }

        // Step 1: Request OTP
        if (!otp) {
            // Check if student exists or create new
            let student = await prisma.student.findUnique({ where: { phone } });
            if (!student) {
                student = await prisma.student.create({ data: { phone } });
            }

            // Generate Mock OTP (Always 1234 for demo)
            // In production, we'd hash it and set expiry
            await prisma.student.update({
                where: { id: student.id },
                data: {
                    otp_hash: await bcrypt.hash('1234', 10),
                    otp_expires_at: new Date(Date.now() + 5 * 60 * 1000) // 5 mins
                }
            });

            return res.json({
                message: 'OTP sent successfully',
                mockOtp: '1234', // Sending back for Hackathon ease of use
                step: 'VERIFY_OTP'
            });
        }

        // Step 2: Verify OTP
        const student = await prisma.student.findUnique({
            where: { phone },
            include: { profile: true }
        });

        if (!student || !student.otp_hash || !student.otp_expires_at) {
            return res.status(400).json({ error: 'Invalid request. Please request OTP first.' });
        }

        if (new Date() > student.otp_expires_at) {
            return res.status(400).json({ error: 'OTP expired' });
        }

        const validOtp = await bcrypt.compare(otp, student.otp_hash);
        if (!validOtp) {
            return res.status(400).json({ error: 'Invalid OTP' });
        }

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
        console.error("Student Login Error:", error);
        res.status(500).json({
            error: 'Internal Server Error',
            details: error.message || String(error)
        });
    }
};
