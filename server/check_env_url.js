
const fs = require('fs');
const dotenv = require('dotenv');
const path = require('path');

const envPath = path.join(__dirname, '.env');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

const dbUrl = envConfig.DATABASE_URL || '';
if (!dbUrl) {
    console.log("❌ DATABASE_URL is missing in .env!");
} else {
    // Mask password
    const masked = dbUrl.replace(/:([^@]+)@/, ':****@');
    console.log("DATABASE_URL found:", masked);
    if (!dbUrl.includes("sslmode=require") && dbUrl.includes("neon.tech")) {
        console.log("⚠️ WARNING: Neon database usually requires ?sslmode=require at the end of the URL.");
    }
}
