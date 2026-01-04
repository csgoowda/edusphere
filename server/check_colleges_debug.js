
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Checking Pending Colleges directly from DB...");

    try {
        const allColleges = await prisma.college.findMany({});
        console.log(`Total Colleges: ${allColleges.length}`);

        allColleges.forEach(c => {
            console.log(`College: ${c.name} (${c.id}) - Status: '${c.status}', Locked: ${c.is_locked}`);
        });

        const pending = await prisma.college.findMany({
            where: {
                status: { in: ['PENDING', 'CORRECTION_REQUIRED'] },
                is_locked: true
            }
        });

        console.log(`\nFiltered Pending Colleges: ${pending.length}`);
        pending.forEach(p => console.log(` - ${p.name}`));

    } catch (e) {
        console.error("Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
