// const aiService = require("../services/ai.service")
// module.exports.getReview = async (req, res) => {
//     const code = req.body.code;
//     if (!code) {
//         return res.status(400).send("Prompt is required");
//     }
//     const response = await aiService(code);
//     res.send(response);
// }



const aiService = require("../services/ai.service");

module.exports.getReview = async (req, res) => {
    try {
        // Extract both code string content and the language identifier from request payload
        const { code, language } = req.body;

        if (!code) {
            return res.status(400).send("Code content string is required.");
        }

        // Pass BOTH the user's code and selected language down to our retry service layer 
        const response = await aiService(code, language);

        res.send(response);
        
    } catch (error) {
        console.error("Error inside getReview controller runtime:", error);
        
        // Return a clean error code status instead of hanging or crashing the server connection
        res.status(500).send("An error occurred while analyzing the code with the AI service.");
    }
};