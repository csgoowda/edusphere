
const crypto = require('crypto');

async function testSubmit() {
    try {
        console.log("1. Logging in...");
        const loginRes = await fetch('http://localhost:5000/api/auth/college/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'demo@inst.com', password: 'password123' })
        });

        if (!loginRes.ok) {
            console.error("Login Failed:", await loginRes.text());
            return;
        }

        const loginData = await loginRes.json();
        const token = loginData.token;
        console.log("Login Success. Token acquired.");

        console.log("2. Submitting Data...");
        const submissionData = {
            courses_offered: ["B.Tech CSE", "MBA"],
            intake_capacity: 120, // Valid number
            accreditation: "A++",
            faculty: [
                { name: "Dr. Smith", designation: "Prof", qualification: "PhD", experience_years: 15, department: "CSE" }
            ],
            placement_percentage: 95.5,
            avg_package: 12.5,
            max_package: 45.0,
            companies_visited: ["Google", "Microsoft"],
            documents: { aicte_approval: "/uploads/dummy.pdf" }
        };

        const submitRes = await fetch('http://localhost:5000/api/college/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(submissionData)
        });

        if (!submitRes.ok) {
            console.error("Submission Failed:", await submitRes.text());
            return;
        }

        const submitData = await submitRes.json();
        console.log("Submission Success:", submitData);

    } catch (e) {
        console.error("Test Error:", e.message);
    }
}
testSubmit();
