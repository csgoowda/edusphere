
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Checking DB Persistence...");

    // 1. Create Trending Course
    console.log("Creating Test Course...");
    try {
        const course = await prisma.trendingCourse.create({
            data: {
                name: "Test Course AI",
                category: "Technology",
                description: "Test description"
            }
        });
        console.log("Course Created:", course.id);

        // 2. Read it back
        const fetched = await prisma.trendingCourse.findUnique({ where: { id: course.id } });
        if (fetched) {
            console.log("Persistence Verified: Course found in DB.");
            // Clean up
            await prisma.trendingCourse.delete({ where: { id: course.id } });
            console.log("Test Course Deleted.");
        } else {
            console.error("FAILURE: Course created but not found!");
        }

        // 3. Scholarship Check
        console.log("Creating Test Scholarship...");
        const sch = await prisma.scholarship.create({
            data: {
                name: "Test Scholarship",
                amount: "10000",
                eligibility: "All",
                link: "http://test.com"
            }
        });
        const fetchedSch = await prisma.scholarship.findUnique({ where: { id: sch.id } });
        if (fetchedSch) {
            console.log("Persistence Verified: Scholarship found in DB.");
            await prisma.scholarship.delete({ where: { id: sch.id } });
        } else {
            console.error("FAILURE: Scholarship created but not found!");
        }

    } catch (e) {
        console.error("DB Error:", e);
    }
}

main()
    .finally(() => prisma.$disconnect());
