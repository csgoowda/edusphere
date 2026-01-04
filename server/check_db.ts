import prisma from './src/config/db';

async function main() {
    console.log("--- DB STATUS CHECK ---");
    try {
        const colleges = await prisma.college.findMany();
        console.log("Total Colleges Found:", colleges.length);
        colleges.forEach(c => {
            console.log(`- ${c.name}: Status=${c.status}, ApprovalStatus=${(c as any).approval_status}, Country=${c.country}`);
        });
    } catch (err) {
        console.error("DB Error:", err);
    } finally {
        await prisma.$disconnect();
    }
}

main();
