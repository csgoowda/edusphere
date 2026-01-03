
import dotenv from 'dotenv';
dotenv.config();

const dbUrl = process.env.DATABASE_URL || '';
if (!dbUrl) {
    console.log("❌ DATABASE_URL is missing in .env!");
} else {
    const masked = dbUrl.replace(/:([^@]+)@/, ':****@');
    console.log("DATABASE_URL found:", masked);
    if (!dbUrl.includes("sslmode=require") && dbUrl.includes("neon.tech")) {
        console.log("⚠️ WARNING: Neon database usually requires ?sslmode=require at the end of the URL.");
    }
}
