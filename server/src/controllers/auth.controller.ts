
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
    college_type: z.enum(['Government', 'Private']),
    country: z.enum(['India', 'Canada', 'USA']),
    state: z.string().min(2),
    district: z.string().min(2),
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

        const college = await (prisma.college as any).create({
            data: {
                name: validated.name,
                email: validated.email,
                password_hash: hashedPassword,
                code: validated.code,
                address: validated.address,
                college_type: validated.college_type,
                country: validated.country,
                state: validated.state,
                district: validated.district,
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
        console.error("[AUTH] Login College Error:", error);
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
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

    } catch (error: any) {
        console.error("[AUTH] Login Government Error:", error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};

// --- Student Auth (Moved to student.controller.ts) ---


