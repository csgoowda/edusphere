console.log("Starting simple test");
const fs = require('fs');
try {
    fs.writeFileSync('simple.txt', 'Hello World');
    console.log("File written");
} catch (e) {
    console.error(e);
}
