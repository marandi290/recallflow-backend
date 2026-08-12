const express = require("express");
const router = express.Router();

const validate = require("../middlewares/validate");
const { generateAISchema } = require("../validators/aiValidator");
const aiController = require("../controllers/aiController");

router.post("/flashcards", validate(generateAISchema, "body"), aiController.generateFlashcards);
router.post("/quiz", validate(generateAISchema, "body"), aiController.generateQuiz);
router.post("/summary", validate(generateAISchema, "body"), aiController.generateSummary);

module.exports = router;
