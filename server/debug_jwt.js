const axios = require('axios');
const jwt = require('jsonwebtoken'); // You verified this is installed in server/package.json

const email = 'pavitrapandeysagar@gmail.com';
const password = '12345';

async function testLogin() {
    try {
        console.log(`Attempting login for ${email}...`);
        const res = await axios.post('http://localhost:5000/api/auth/login', {
            email,
            password
        });

        const token = res.data.token;
        console.log("Login successful. Token received.");

        const decoded = jwt.decode(token);
        console.log("Decoded Token Payload:", JSON.stringify(decoded, null, 2));

        if (decoded.user && decoded.user.username) {
            console.log("SUCCESS: Username is present in the token.");
        } else {
            console.error("FAILURE: Username is MISSING from the token.");
        }

    } catch (error) {
        if (error.response) {
            console.error("Login Failed:", error.response.status, error.response.data);
            if (error.response.data.error === "Invalid Credentials") {
                // Try registering instead if login fails (maybe user doesn't exist yet?)
                console.log("User might not exist. Trying registration...");
                try {
                    const regRes = await axios.post('http://localhost:5000/api/auth/register', {
                        username: 'pavitra',
                        email,
                        password
                    });
                    const regToken = regRes.data.token;
                    const regDecoded = jwt.decode(regToken);
                    console.log("Registration Successful. Decoded Payload:", JSON.stringify(regDecoded, null, 2));
                } catch (regErr) {
                    console.error("Registration failed:", regErr.response ? regErr.response.data : regErr.message);
                }
            }
        } else {
            console.error("Network/Server Error:", error.message);
        }
    }
}

testLogin();
