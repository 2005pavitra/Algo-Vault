const axios = require('axios');

const username = '_pavitra_pandey';
const query = `
    query getUserProfile($username: String!) {
        allQuestionsCount {
            difficulty
            count
        }
        matchedUser(username: $username) {
            submitStats {
                acSubmissionNum {
                    difficulty
                    count
                    submissions
                }
            }
        }
    }
`;

async function testLeetCode() {
    try {
        console.log(`Fetching data for: ${username}`);
        const response = await axios.post(
            'https://leetcode.com/graphql',
            {
                query,
                variables: { username }
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
                }
            }
        );

        if (response.data.errors) {
            console.error('GraphQL Errors:', JSON.stringify(response.data.errors, null, 2));
        } else {
            console.log('Response Data:', JSON.stringify(response.data.data, null, 2));
        }

    } catch (error) {
        console.error('Error:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
    }
}

testLeetCode();
