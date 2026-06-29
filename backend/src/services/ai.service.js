const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.google_gemini_key);

const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: `
Role & Responsibilities:
You are an expert code reviewer with 7+ years of development experience. Analyze and improve code focusing on Code Quality, Best Practices, Performance, Error/Bug Detection, Security Risks, and Scalability.

Guidelines for Review:
1. Provide Constructive Feedback: Be detailed yet concise.
2. Suggest Code Improvements: Offer clean refactored code blocks using correct markdown language wrappers.
3. Security Compliance: Look for common vulnerabilities (e.g., SQL injection, XSS).
4. DRY & SOLID: Reduce code duplication and promote modular design.
5. Code Format: Output response strictly utilizing structured markdown.

Tone & Approach:
- Be precise, technical, directly to the point, and avoid conversational fluff.
- Highlight major architectural weaknesses or logical defects instantly.

Output Example Structure:
❌ Bad Code (if applicable)
🔍 Issues (bulleted lists)
✅ Recommended Fix (full pristine code blocks)
💡 Improvements (why it is better)
`
});

// Helper utility to introduce execution pauses
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Generates an AI code review with a clean, fault-tolerant retry wrapper.
 * @param {string} code - The source code to review.
 * @param {string} language - The language identifier (e.g., 'javascript', 'python', 'cpp')
 */
async function generateContent(code, language = 'javascript') {
    let attempts = 0;
    const maxAttempts = 3;

    // Tailor the runtime user prompt based on the selected framework language metadata passed from your frontend drop-down menu
    const targetPrompt = `Please perform a comprehensive senior code review on this structural block of ${language.toUpperCase()} code:\n\n\`\`\`${language}\n${code}\n\`\`\``;

    while (attempts < maxAttempts) {
        try {
            attempts++;
            const result = await model.generateContent(targetPrompt);
            return result.response.text(); // Success! Return back text cleanly.

        } catch (error) {
            const errorMsg = error.message || "";
            // Check for Rate Limit status codes or resource demand indicators
            const isRateLimit = error.status === 429 || errorMsg.includes('429') || errorMsg.toLowerCase().includes('exhausted');

            if (isRateLimit && attempts < maxAttempts) {
                const backoffTime = 2000 * attempts; // Wait 2 seconds, then 4 seconds...
                console.warn(`[Gemini API Busy] Rate limit triggered (Attempt ${attempts}/${maxAttempts}). Backing off for ${backoffTime / 1000}s...`);
                await delay(backoffTime);
                continue; // Loop execution back around to try the block request again
            }

            // If it is an alternative failure type, or we have completely run out of recovery retry windows
            console.error("Fatal AI Service Error during generation runtime:", error);
            throw error;
        }
    }
}

module.exports = generateContent;