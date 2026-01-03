const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Seeding 5 Demo Data Items...");

    try {
        // --- Trending Courses (5 Items) ---
        console.log("Adding 5 Trending Courses...");
        const courses = [
            { name: "Full Stack Development", category: "Software", description: "Master MERN Stack (MongoDB, Express, React, Node)" },
            { name: "Data Science & AI", category: "Data", description: "Python, Machine Learning, and Neural Networks" },
            { name: "Cyber Security", category: "Security", description: "Ethical Hacking and Network Defense" },
            { name: "Cloud Computing", category: "Infrastructure", description: "AWS Solution Architect & Azure Fundamentals" },
            { name: "Blockchain Technology", category: "Web3", description: "Smart Contracts and DApp Development" }
        ];

        for (const c of courses) {
            // Upsert to avoid duplicates if running multiple times (based on name if unique, but schema doesn't force unique name, so create is fine)
            await prisma.trendingCourse.create({ data: c });
        }

        // --- Scholarships (5 Items) ---
        console.log("Adding 5 Scholarships...");
        const scholarships = [
            { name: "AICTE Pragati Scholarship", amount: "50000", eligibility: "Girl Students in Technical Degree", link: "https://aicte-india.org/schemes/students-development-schemes" },
            { name: "Post Matric Scholarship", amount: "15000", eligibility: "SC/ST Students with Family Income < 2.5L", link: "https://scholarships.gov.in/" },
            { name: "Merit Cum Means Scholarship", amount: "25000", eligibility: "Minority Communities, Top 30% Rankers", link: "https://scholarships.gov.in/" },
            { name: "National Overseas Scholarship", amount: "1500000", eligibility: "Master/PhD Abroad for SC/ST", link: "https://socialjustice.gov.in/" },
            { name: "PM Research Fellowship", amount: "70000", eligibility: "Top B.Tech/M.Tech Students for PhD", link: "https://pmrf.in/" }
        ];

        for (const s of scholarships) {
            await prisma.scholarship.create({ data: s });
        }

        console.log("Seeding Completed Successfully.");
    } catch (e) {
        console.error("Seeding Failed:", e);
    }
}

main()
    .finally(() => prisma.$disconnect());
