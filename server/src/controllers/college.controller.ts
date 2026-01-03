
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../config/db';

import { z } from 'zod';

const SubmissionSchema = z.object({
    courses_offered: z.array(z.string()),
    fees_per_course: z.array(z.object({
        course: z.string(),
        fee: z.string()
    })).optional().default([]),
    intake_capacity: z.any().transform((val) => parseInt(val)),
    accreditation: z.string(),
    faculty: z.array(z.object({
        name: z.string(),
        designation: z.string(),
        qualification: z.string(),
        experience_years: z.any().transform((val) => parseInt(val)),
        department: z.string()
    })),
    placement_percentage: z.any().transform((val) => parseFloat(val)),
    avg_package: z.any().transform((val) => parseFloat(val)),
    max_package: z.any().transform((val) => parseFloat(val)),
    companies_visited: z.array(z.string()),
    documents: z.record(z.string()).optional()
});

export const getCollegeDetails = async (req: AuthRequest, res: Response) => {
    try {
        const collegeId = req.user?.id;
        if (!collegeId) return res.status(401).json({ error: 'Unauthorized' });

        const college = await prisma.college.findUnique({
            where: { id: collegeId },
            include: {
                academic_details: true,
                faculty: true,
                placement_details: true,
                documents: true,
            }
        });

        if (!college) return res.status(404).json({ error: 'College not found' });
        const { password_hash, ...data } = college;
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const submitCollegeData = async (req: AuthRequest, res: Response) => {
    try {
        const collegeId = req.user?.id;
        const data = SubmissionSchema.parse(req.body);

        if (!collegeId) return res.status(401).json({ error: 'Unauthorized' });

        // Transaction to ensure atomicity
        await prisma.$transaction(async (tx: any) => {
            // 1. Update College Status & Lock
            await tx.college.update({
                where: { id: collegeId },
                data: {
                    status: 'PENDING',
                    is_locked: true,
                    remarks: null // Clear previous remarks on resubmission
                }
            });

            // 2. Academic Details (Upsert)
            await tx.academicDetail.upsert({
                where: { college_id: collegeId },
                update: {
                    courses_offered: JSON.stringify(data.courses_offered),
                    fees_per_course: JSON.stringify(data.fees_per_course),
                    intake_capacity: data.intake_capacity,
                    accreditation: data.accreditation
                },
                create: {
                    college_id: collegeId,
                    courses_offered: JSON.stringify(data.courses_offered),
                    fees_per_course: JSON.stringify(data.fees_per_course),
                    intake_capacity: data.intake_capacity,
                    accreditation: data.accreditation
                }
            });

            // 3. Faculty (Delete all and Re-create)
            await tx.faculty.deleteMany({ where: { college_id: collegeId } });
            if (data.faculty && data.faculty.length > 0) {
                await tx.faculty.createMany({
                    data: data.faculty.map((f: any) => ({
                        college_id: collegeId,
                        name: f.name,
                        designation: f.designation,
                        qualification: f.qualification,
                        experience_years: f.experience_years,
                        department: f.department
                    }))
                });
            }

            // 4. Placement Details (Upsert)
            await tx.placementDetail.upsert({
                where: { college_id: collegeId },
                update: {
                    placement_percentage: data.placement_percentage,
                    avg_package: data.avg_package,
                    max_package: data.max_package,
                    companies_visited: JSON.stringify(data.companies_visited),
                    proof_url: (data.documents && data.documents.placement_proof) ? data.documents.placement_proof : ''
                },
                create: {
                    college_id: collegeId,
                    placement_percentage: data.placement_percentage,
                    avg_package: data.avg_package,
                    max_package: data.max_package,
                    companies_visited: JSON.stringify(data.companies_visited),
                    proof_url: (data.documents && data.documents.placement_proof) ? data.documents.placement_proof : ''
                }
            });

            // 5. Documents (Upsert per type)
            // Since we store separate rows for document types or a single link?
            // Schema says: Document model has `type` and `url`.
            // We should delete old documents and insert new ones to be safe, or upsert by type?
            // Prisma schema doesn't seem to enforce unique (college_id, type) but it should.
            // Let's delete old and re-create.
            await tx.document.deleteMany({ where: { college_id: collegeId } });
            if (data.documents) {
                const docData = Object.entries(data.documents).map(([key, url]) => ({
                    college_id: collegeId,
                    type: key, // aicte_approval, etc.
                    url: url as string
                })).filter(d => d.url); // only if url exists

                if (docData.length > 0) {
                    await tx.document.createMany({ data: docData });
                }
            }
        });

        res.json({ message: 'Submission successful. Waiting for Government Verification.' });

    } catch (error: any) {
        if (error instanceof z.ZodError) {
            console.error("Validation Error:", error.errors);
            return res.status(400).json({ error: 'Validation Failed', details: error.errors });
        }
        console.error("Submit Error:", error);
        res.status(500).json({ error: 'Submission Failed' });
    }
};
