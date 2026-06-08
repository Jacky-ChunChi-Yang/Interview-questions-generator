import express from "express";
import multer from "multer";
import { extractTextFromResume } from "../services/resumeParser.js";
import {
  analyzeResumeText,
  evaluateInterviewAnswer,
  generateInterviewQuestions
} from "../services/aiService.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/resume/analyze", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Resume file is required" });
    }

    const resumeText = await extractTextFromResume(req.file);
    const analysis = analyzeResumeText(resumeText);

    return res.json({ analysis });
  } catch (error) {
    return res.status(400).json({ error: error.message || "Resume analysis failed" });
  }
});

router.post("/questions/generate", (req, res) => {
  try {
    const { analysis, count = 10 } = req.body ?? {};
    if (!analysis) {
      return res.status(400).json({ error: "analysis is required" });
    }

    const questions = generateInterviewQuestions(analysis, Number(count));
    return res.json({ questions });
  } catch (error) {
    return res.status(400).json({ error: error.message || "Question generation failed" });
  }
});

router.post("/answers/evaluate", (req, res) => {
  const { question, answer, relatedSkill } = req.body ?? {};
  if (!question || !answer) {
    return res.status(400).json({ error: "question and answer are required" });
  }

  const feedback = evaluateInterviewAnswer({ question, answer, relatedSkill });
  return res.json({ feedback });
});

export default router;
