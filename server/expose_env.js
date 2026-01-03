
const fs = require('fs');
const path = require('path');
try {
    const envContent = fs.readFileSync('.env', 'utf8');
    const lines = envContent.split('\n');
    let summary = "";
    lines.forEach(line => {
        if (line.includes('DATABASE_URL')) {
            summary += line.substring(0, 25) + "...\n";
        }
    });
    fs.writeFileSync('env_check.txt', summary);
    console.log("Success");
} catch (err) {
    fs.writeFileSync('env_check.txt', "Error: " + err.message);
}
