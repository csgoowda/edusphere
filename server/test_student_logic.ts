
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function testStudentLogin() {
    const phone = '8095406516';
    try {
        console.log(`Testing Student Login logic for phone: ${phone}`);
        // This simulates the Step 1 of loginStudent
        let student = await prisma.student.findUnique({ where: { phone } });
        if (!student) {
            console.log("Student not found, creating...");
            student = await prisma.student.create({ data: { phone } });
            console.log("Student created:", student.id);
        } else {
            console.log("Student found:", student.id);
        }

        const otp_hash = '$2a$10$S9VfX0l0X0l0X0l0X0l0X.X0l0X0l0X0l0X0l0X0l0X0l0X0l0X0l'; // Dummy hash
        await prisma.student.update({
            where: { id: student.id },
            data: {
                otp_hash: otp_hash,
                otp_expires_at: new Date(Date.now() + 5 * 60 * 1000)
            }
        });
        console.log("✅ OTP update successful. Database connection is working.");
    } catch (err: any) {
        console.error("❌ Database Operation Failed!");
        console.error("Error Message:", err.message);
        if (err.code) console.error("Prisma Error Code:", err.code);
    } finally {
        await prisma.$disconnect();
    }
}

testStudentLogin();
