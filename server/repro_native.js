
const http = require('http');
const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, 'repro_result_native.log');

function log(msg) {
    try {
        fs.appendFileSync(LOG_FILE, `[${new Date().toISOString()}] ${msg}\n`);
        console.log(msg);
    } catch (e) { console.error(e); }
}

function request(url, options, data) {
    return new Promise((resolve, reject) => {
        const parsedUrl = new URL(url);
        const reqOptions = {
            hostname: parsedUrl.hostname,
            port: parsedUrl.port,
            path: parsedUrl.pathname,
            method: options.method || 'GET',
            headers: options.headers || {}
        };

        const req = http.request(reqOptions, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                resolve({
                    status: res.statusCode,
                    body: body
                });
            });
        });

        req.on('error', (e) => reject(e));

        if (data) {
            req.write(data);
        }
        req.end();
    });
}

async function run() {
    try {
        fs.writeFileSync(LOG_FILE, 'Starting Native Test\n');

        // 1. Login
        log("Logging in...");
        const loginData = JSON.stringify({ id: 'GOV001', password: 'admin' });
        const loginRes = await request('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': loginData.length
            }
        }, loginData);

        log(`Login Status: ${loginRes.status}`);
        if (loginRes.status !== 200) {
            log(`Login Body: ${loginRes.body}`);
            return;
        }

        const token = JSON.parse(loginRes.body).token;
        log("Token acquired.");

        // 2. Add Scholarship
        log("Adding scholarship...");
        const schData = JSON.stringify({
            name: "Native Test Sch " + Date.now(),
            amount: "12345",
            eligibility: "Native Node",
            link: "http://native.com"
        });
        const addRes = await request('http://localhost:5000/api/gov/scholarships', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': schData.length,
                'Authorization': 'Bearer ' + token
            }
        }, schData);

        log(`Add Status: ${addRes.status}`);
        if (addRes.status !== 200) {
            log(`Add Body: ${addRes.body}`);
            return;
        }
        const addedId = JSON.parse(addRes.body).id;
        log(`Added ID: ${addedId}`);

        // 3. Get Scholarships
        log("Fetching...");
        const getRes = await request('http://localhost:5000/api/gov/scholarships', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        log(`Get Status: ${getRes.status}`);
        const list = JSON.parse(getRes.body);
        const found = list.find(s => s.id === addedId);
        log(`Found in list? ${!!found}`);
        log(`List length: ${list.length}`);

    } catch (e) {
        log(`Exception: ${e.message}`);
        log(e.stack);
    }
}

run();
