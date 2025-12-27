// Algo-Vault Collector Background Script

// Listen for LeetCode and CodeChef submissions
chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
        if (details.method === "POST" && details.requestBody) {
            // console.log("Algo-Vault: Intercepted POST request", details.url);

            let payload = {};
            let sourceCode = "";
            let problemTitle = "";
            let platform = "";
            let tags = [];

            // 1. Parse the Body
            if (details.requestBody.raw) {
                try {
                    const decoder = new TextDecoder("utf-8");
                    const rawData = details.requestBody.raw[0].bytes;
                    payload = JSON.parse(decoder.decode(rawData));
                } catch (e) {
                    console.log("Could not parse raw body", e);
                }
            } else if (details.requestBody.formData) {
                payload = details.requestBody.formData;
            }

            // 2. Platform Specific Extraction
            if (details.url.includes("leetcode.com")) {
                platform = "LeetCode";
                // LeetCode submit payload usually has: casted_question_id, typed_code, lang
                if (payload.typed_code) {
                    sourceCode = payload.typed_code;

                    // Extract Title from URL: https://leetcode.com/problems/two-sum/submit/
                    try {
                        const urlParts = details.url.split('/problems/');
                        if (urlParts.length > 1) {
                            const slug = urlParts[1].split('/')[0];
                            // Format: "two-sum" -> "Two Sum"
                            problemTitle = slug
                                .split('-')
                                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                .join(' ');
                        }
                    } catch (e) {
                        console.error("Error extracting title from URL:", e);
                    }

                    // Fallback if URL parsing failed
                    if (!problemTitle || problemTitle === "") {
                        problemTitle = payload.question_id ? `LeetCode ${payload.question_id}` : "LeetCode Problem";
                    }
                }
            } else if (details.url.includes("codechef.com")) {
                platform = "CodeChef";
                // CodeChef often uses FormData: sourceCode, problemCode
                if (payload.sourceCode) {
                    sourceCode = Array.isArray(payload.sourceCode) ? payload.sourceCode[0] : payload.sourceCode;
                }
                if (payload.problemCode) {
                    problemTitle = Array.isArray(payload.problemCode) ? payload.problemCode[0] : payload.problemCode;
                }
            }

            // 3. Send if we found code
            if (sourceCode) {
                console.log(`Algo-Vault: Captured submission for ${platform}: ${problemTitle}`);

                const dataToSend = {
                    url: details.url,
                    platform: platform,
                    title: problemTitle,
                    code: sourceCode,
                    tags: tags, // Tags might need to be fetched separately or inferred
                    timestamp: new Date().toISOString()
                };

                // Send to localhost
                fetch('http://localhost:5000/api/save-problem', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dataToSend)
                })
                    .then(response => response.json())
                    .then(data => console.log('Successfully sent to Algo-Vault:', data))
                    .catch(error => console.error('Error sending to Algo-Vault:', error));
            }
        }
    },
    {
        urls: [
            "https://leetcode.com/problems/*/submit/",
            "https://leetcode.com/submissions/detail/*/check/",
            "https://www.codechef.com/api/ide/submit"
        ]
    },
    ["requestBody"]
);
