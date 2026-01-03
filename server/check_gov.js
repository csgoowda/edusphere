
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const id = 'GOV001';
    const pass = 'admin';

    console.log(`Checking for user: ${id}`);

    let user = await prisma.governmentUser.findUnique({ where: { employee_id: id } });

    if (!user) {
        console.log("User not found. Creating...");
        const hash = await bcrypt.hash(pass, 10);
        user = await prisma.governmentUser.create({
            data: {
                employee_id: id,
                password_hash: hash,
                name: 'Admin Officer'
            }
        });
        console.log("User created successfully.");
    } else {
        console.log("User exists.");
        // Verify password
        const valid = await bcrypt.compare(pass, user.password_hash);
        console.log("Is password 'admin' valid?", valid);

        if (!valid) {
            console.log("Password incorrect. Resetting to 'admin'...");
            const hash = await bcrypt.hash(pass, 10);
            await prisma.governmentUser.update({
                where: { id: user.id },
                data: { password_hash: hash }
            });
            console.log("Password reset successfully.");
        }
    }
}

main()
    .catch(e => {
        console.error("Error checking user:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
