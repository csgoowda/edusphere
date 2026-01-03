const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Checking DB Counts...");
    try {
        const courseCount = await prisma.trendingCourse.count();
        const schCount = await prisma.scholarship.count();

        console.log(`Trending Courses: ${courseCount}`);
        console.log(`Scholarships: ${schCount}`);

        if (courseCount >= 5 && schCount >= 5) {
            console.log("SUCCESS: 5+ items present.");
        } else {
            console.log("PENDING: Less than 5 items.");
        }
    } catch (e) {
        console.error("Check Failed:", e);
    }
}

main().finally(() => prisma.$disconnect());
