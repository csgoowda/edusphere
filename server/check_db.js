const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    console.log("Checking DB...");
    const count = await prisma.college.count();
    const approved = await prisma.college.count({ where: { status: 'APPROVED' } });
    console.log('Total Colleges:', count);
    console.log('Approved Colleges:', approved);
    const all = await prisma.college.findMany({
        select: { name: true, status: true, approval_status: true, college_type: true }
    });
    console.log('All Colleges:', JSON.stringify(all, null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());
