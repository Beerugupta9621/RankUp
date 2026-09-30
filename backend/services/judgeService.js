const axios = require("axios");

const JUDGE0_URL =
    process.env.JUDGE0_URL || "https://ce.judge0.com";

const runCode = async (sourceCode, languageId, stdin = "") => {
    try {
        const response = await axios.post(
            `${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`,
            {
                source_code: sourceCode,
                language_id: languageId,
                stdin: stdin
            },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        return response.data;

    } catch (error) {
        console.error(
            "Judge0 error:",
            error.response?.data || error.message
        );

        throw new Error("Code execution failed");
    }
};

module.exports = {
    runCode
};