
async function test() {
    try {
        const res = await fetch('http://localhost:5000/api/auth/college/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'demo@inst.com', password: 'password123' })
        });
        const data = await res.json();
        console.log('Status:', res.status);
        console.log('Body:', data);
    } catch (e) {
        console.log('Error:', e.message);
    }
}
test();
