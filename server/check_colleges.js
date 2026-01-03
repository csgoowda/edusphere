
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkColleges() {
    try {
        const colleges = await prisma.college.findMany();
        console.log('Total Colleges:', colleges.length);
        colleges.forEach(c => {
            console.log(`- [${c.id}] ${c.name} | Status: ${c.status} | Locked: ${c.is_locked}`);
        });
    } catch (e) {
        console.error('Error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

checkColleges();
