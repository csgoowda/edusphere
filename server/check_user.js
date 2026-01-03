
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUser() {
    try {
        const user = await prisma.governmentUser.findUnique({
            where: { employee_id: 'GOV001' }
        });
        console.log('User found:', user ? 'YES' : 'NO');
        if (user) console.log('User data:', user);
    } catch (e) {
        console.error('Error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

checkUser();
