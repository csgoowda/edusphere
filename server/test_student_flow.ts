
import { sendOtp, verifyOtp } from './src/controllers/auth.controller';
import { Request, Response } from 'express';

// Mock Express objects
const mockRes = () => {
    const res: any = {};
    res.status = (code: number) => { res.statusCode = code; return res; };
    res.json = (data: any) => { res.body = data; return res; };
    return res;
};

async function runTest() {
    console.log("--- Testing sendOtp ---");
    const req1 = { body: { phone: "8888888888" } } as Request;
    const res1 = mockRes();
    await sendOtp(req1, res1);
    console.log("Send OTP Status:", res1.statusCode || 200);
    console.log("Send OTP Response:", res1.body);

    console.log("\n--- Testing verifyOtp ---");
    const req2 = { body: { phone: "8888888888", otp: "1234" } } as Request;
    const res2 = mockRes();
    await verifyOtp(req2, res2);
    console.log("Verify OTP Status:", res2.statusCode || 200);
    console.log("Verify OTP Response:", res2.body);

    if (res2.body && res2.body.token) {
        console.log("\n✅ SUCCESS: Token received!");
    } else {
        console.log("\n❌ FAILED: No token received.");
    }
}

runTest().catch(console.error);
