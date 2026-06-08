import test from "node:test";
import assert from "node:assert/strict";
import {
  analyzeResumeText,
  evaluateInterviewAnswer,
  generateInterviewQuestions
} from "../src/services/aiService.js";

test("analyzeResumeText detects core fields", () => {
  const analysis = analyzeResumeText("5 years building React and Node.js apps with a Bachelor's degree");

  assert.ok(analysis.skills.includes("react"));
  assert.equal(analysis.experience, "5 years");
  assert.equal(analysis.education, "Bachelor's Degree");
});

test("generateInterviewQuestions returns typed question objects", () => {
  const questions = generateInterviewQuestions({ skills: ["react", "node.js"] }, 10);

  assert.equal(questions.length, 10);
  assert.ok(questions.every((q) => q.type === "technical" || q.type === "behavioral"));
  assert.ok(questions.every((q) => ["easy", "medium", "hard"].includes(q.difficulty)));
});

test("evaluateInterviewAnswer returns bounded score and feedback fields", () => {
  const feedback = evaluateInterviewAnswer({
    question: "How do you test React components?",
    answer:
      "I use React Testing Library for behavior-driven tests, create realistic mocks, and verify outcomes for accessibility and user interactions.",
    relatedSkill: "react"
  });

  assert.ok(feedback.score >= 1 && feedback.score <= 10);
  assert.ok(feedback.clarity);
  assert.ok(Array.isArray(feedback.suggestions));
});
