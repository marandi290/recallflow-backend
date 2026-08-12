const aiService = require("../services/aiService");
const asyncHandler = require("../middlewares/asyncHandler");

const generateFlashcards = asyncHandler(async (req, res) => {
    const result = await aiService.generateFlashcards(req.body);
    return res.status(200).json({
        success: true,
        message: "Flashcards generated successfully",
        data: result,
    });
});

const generateQuiz = asyncHandler(async (req, res) => {
    const result = await aiService.generateQuiz(req.body);
    return res.status(200).json({
        success: true,
        message: "Quiz generated successfully",
        data: result,
    });
});

const generateSummary = asyncHandler(async (req, res) => {
    const result = await aiService.generateSummary(req.body);
    return res.status(200).json({
        success: true,
        message: "Summary generated successfully",
        data: result,
    });
});

module.exports = {
    generateFlashcards,
    generateQuiz,
    generateSummary,
};
