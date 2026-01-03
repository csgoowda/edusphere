
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function test() {
    try {
        console.log("Attempting to connect to database...");
        await prisma.$connect();
        console.log("Connection successful!");
        const count = await prisma.student.count();
        console.log("Student count:", count);
    } catch (err) {
        console.error("Connection failed!");
        console.error(err);
    } finally {
        await prisma.$disconnect();
    }
}

test();
