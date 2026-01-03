
const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, 'repro_result.log');

function log(msg) {
    fs.appendFileSync(LOG_FILE, `[${new Date().toISOString()}] ${msg}\n`);
    console.log(msg);
}

async function testPersistence() {
    try {
        // Clear log
        fs.writeFileSync(LOG_FILE, '');
        log("Starting persistence test (using fetch)");

        // 1. Login
        log("Logging in...");
        const loginRes = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: 'GOV001', password: 'admin' })
        });

        if (!loginRes.ok) {
            log(`Login failed: ${loginRes.status} ${loginRes.statusText}`);
            const txt = await loginRes.text();
            log(`Response: ${txt}`);
            return;
        }

        const loginData = await loginRes.json();
        const token = loginData.token;
        log(`Login successful. Token acquired.`);

        // 2. Add Scholarship
        log("Adding scholarship...");
        const newSch = {
            name: "Test Persistence Scholarship " + Date.now(),
            amount: "50000",
            eligibility: "Top 1%",
            link: "http://example.com"
        };
        const addRes = await fetch('http://localhost:5000/api/gov/scholarships', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(newSch)
        });

        if (!addRes.ok) {
            const txt = await addRes.text();
            log(`Add failed: ${addRes.status} ${txt}`);
            return;
        }
        const addData = await addRes.json();
        const addedId = addData.id;
        log(`Added ID: ${addedId}`);

        // 3. Fetch Scholarships immediately
        log("Fetching immediately...");
        const fetch1 = await fetch('http://localhost:5000/api/gov/scholarships', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const list1 = await fetch1.json();
        const found1 = list1.find(s => s.id === addedId);
        log(`Found immediately? ${!!found1}`);

    } catch (err) {
        log(`Error: ${err.message}`);
        log(err.stack);
    }
}

testPersistence();
