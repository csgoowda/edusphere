
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

import fs from 'fs';
async function test() {
    let log = "Starting Test...\n";
    try {
        log += "Attempting to connect to database...\n";
        await prisma.$connect();
        log += "Connection successful!\n";
        const count = await prisma.student.count();
        log += `Student count: ${count}\n`;
    } catch (err: any) {
        log += "Connection failed!\n";
        log += err.message + "\n";
        log += err.stack + "\n";
    } finally {
        await prisma.$disconnect();
        fs.writeFileSync('db_status.txt', log);
    }
}

test();
