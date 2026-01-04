
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const fs = require('fs');

const prisma = new PrismaClient();

async function main() {
    let log = '';
    const id = 'GOV001';
    const pass = 'admin';

    try {
        log += `Checking for user: ${id}\n`;
        let user = await prisma.governmentUser.findUnique({ where: { employee_id: id } });

        if (!user) {
            log += "User not found. Creating...\n";
            const hash = await bcrypt.hash(pass, 10);
            user = await prisma.governmentUser.create({
                data: {
                    employee_id: id,
                    password_hash: hash,
                    name: 'Admin Officer'
                }
            });
            log += "User created successfully.\n";
        } else {
            log += "User exists.\n";
            const valid = await bcrypt.compare(pass, user.password_hash);
            log += `Is password 'admin' valid? ${valid}\n`;

            if (!valid) {
                log += "Password incorrect. Resetting to 'admin'...\n";
                const hash = await bcrypt.hash(pass, 10);
                await prisma.governmentUser.update({
                    where: { id: user.id },
                    data: { password_hash: hash }
                });
                log += "Password reset successfully.\n";
            }
        }
    } catch (e) {
        log += `Error: ${e.message}\n${e.stack}\n`;
    } finally {
        await prisma.$disconnect();
        fs.writeFileSync('gov_check_status.txt', log);
    }
}

main();
