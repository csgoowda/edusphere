
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
    try {
        console.log("Checking Prisma Client...");
        if (prisma.trendingCourse) {
            console.log("✅ prisma.trendingCourse exists!");
            const count = await prisma.trendingCourse.count();
            console.log("Count:", count);
        } else {
            console.error("❌ prisma.trendingCourse is UNDEFINED");
            console.log("Available models:", Object.keys(prisma).filter(k => !k.startsWith('_')));
        }
    } catch (e) {
        console.error("Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

check();
