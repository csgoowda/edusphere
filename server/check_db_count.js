const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    let log = "Checking DB Counts...\n";
    console.log("Checking DB Counts...");
    try {
        const courseCount = await prisma.trendingCourse.count();
        const schCount = await prisma.scholarship.count();

        log += `Trending Courses: ${courseCount}\n`;
        log += `Scholarships: ${schCount}\n`;
        console.log(`Trending Courses: ${courseCount}`);
        console.log(`Scholarships: ${schCount}`);

        if (courseCount >= 5 && schCount >= 5) {
            log += "SUCCESS: 5+ items present.\n";
            console.log("SUCCESS: 5+ items present.");
        } else {
            log += "PENDING: Less than 5 items.\n";
            console.log("PENDING: Less than 5 items.");
        }
        fs.writeFileSync('db_status.txt', log);
    } catch (e) {
        console.error("Check Failed:", e);
        fs.writeFileSync('db_status.txt', `Check Failed: ${e.message}\n${e.stack}`);
    } finally {
        await prisma.$disconnect();
    }
}

main();
