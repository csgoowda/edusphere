
import { Request, Response } from 'express';
import prisma from '../config/db';

export const getPublicStats = async (req: Request, res: Response) => {
    try {
        const [
            totalColleges,
            approvedColleges,
            totalStudents,
            avgPackageResult
        ] = await Promise.all([
            prisma.college.count(),
            prisma.college.count({ where: { status: 'APPROVED' } }),
            prisma.student.count(),
            prisma.placementDetail.aggregate({
                _avg: { avg_package: true }
            })
        ]);

        res.json({
            total_colleges: totalColleges,
            verified_institutes: approvedColleges,
            registered_students: totalStudents,
            avg_placement_package: avgPackageResult._avg.avg_package ? avgPackageResult._avg.avg_package.toFixed(1) : '0'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Stats Fetch Failed' });
    }
};

import fs from 'fs';

export const getTrendingCourses = async (req: Request, res: Response) => {
    try {
        const prismaAny = prisma as any;
        if (prismaAny.trendingCourse) {
            const courses = await prismaAny.trendingCourse.findMany();
            if (courses && courses.length > 0) return res.json(courses);
        }
        // Fallback if DB is empty or model missing
        console.warn("Using Fallback Data for Trending Courses");
        res.json([
            { id: '1', name: "Full Stack Development", category: "Software", description: "Master MERN Stack (MongoDB, Express, React, Node)" },
            { id: '2', name: "Data Science & AI", category: "Data", description: "Python, Machine Learning, and Neural Networks" },
            { id: '3', name: "Cyber Security", category: "Security", description: "Ethical Hacking and Network Defense" },
            { id: '4', name: "Cloud Computing", category: "Infrastructure", description: "AWS Solution Architect & Azure Fundamentals" },
            { id: '5', name: "Blockchain Technology", category: "Web3", description: "Smart Contracts and DApp Development" }
        ]);
    } catch (error: any) {
        console.error("Trending Fetch Error (Using Fallback):", error.message);
        res.json([
            { id: '1', name: "Full Stack Development", category: "Software", description: "Master MERN Stack (MongoDB, Express, React, Node)" },
            { id: '2', name: "Data Science & AI", category: "Data", description: "Python, Machine Learning, and Neural Networks" },
            { id: '3', name: "Cyber Security", category: "Security", description: "Ethical Hacking and Network Defense" },
            { id: '4', name: "Cloud Computing", category: "Infrastructure", description: "AWS Solution Architect & Azure Fundamentals" },
            { id: '5', name: "Blockchain Technology", category: "Web3", description: "Smart Contracts and DApp Development" }
        ]);
    }
};

export const getScholarships = async (req: Request, res: Response) => {
    try {
        const scholarships = await prisma.scholarship.findMany();
        if (scholarships && scholarships.length > 0) return res.json(scholarships);

        // Fallback
        console.warn("Using Fallback Data for Scholarships");
        res.json([
            { id: '1', name: "AICTE Pragati Scholarship", amount: "50000", eligibility: "Girl Students in Technical Degree", link: "https://aicte-india.org/schemes/students-development-schemes" },
            { id: '2', name: "Post Matric Scholarship", amount: "15000", eligibility: "SC/ST Students with Family Income < 2.5L", link: "https://scholarships.gov.in/" },
            { id: '3', name: "Merit Cum Means Scholarship", amount: "25000", eligibility: "Minority Communities, Top 30% Rankers", link: "https://scholarships.gov.in/" },
            { id: '4', name: "National Overseas Scholarship", amount: "1500000", eligibility: "Master/PhD Abroad for SC/ST", link: "https://socialjustice.gov.in/" },
            { id: '5', name: "PM Research Fellowship", amount: "70000", eligibility: "Top B.Tech/M.Tech Students for PhD", link: "https://pmrf.in/" }
        ]);
    } catch (error: any) {
        console.error("Scholarship Fetch Error (Using Fallback):", error.message);
        res.json([
            { id: '1', name: "AICTE Pragati Scholarship", amount: "50000", eligibility: "Girl Students in Technical Degree", link: "https://aicte-india.org/schemes/students-development-schemes" },
            { id: '2', name: "Post Matric Scholarship", amount: "15000", eligibility: "SC/ST Students with Family Income < 2.5L", link: "https://scholarships.gov.in/" },
            { id: '3', name: "Merit Cum Means Scholarship", amount: "25000", eligibility: "Minority Communities, Top 30% Rankers", link: "https://scholarships.gov.in/" },
            { id: '4', name: "National Overseas Scholarship", amount: "1500000", eligibility: "Master/PhD Abroad for SC/ST", link: "https://socialjustice.gov.in/" },
            { id: '5', name: "PM Research Fellowship", amount: "70000", eligibility: "Top B.Tech/M.Tech Students for PhD", link: "https://pmrf.in/" }
        ]);
    }
};
