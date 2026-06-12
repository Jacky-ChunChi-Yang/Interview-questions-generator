const KNOWN_SKILLS = [
  "javascript",
  "typescript",
  "react",
  "node.js",
  "express",
  "postgresql",
  "python",
  "java",
  "docker",
  "aws",
  "sql",
  "testing"
];

const TECHNICAL_TEMPLATES = [
  "How have you used {{skill}} in production projects?",
  "Describe a challenging bug you solved using {{skill}}.",
  "What trade-offs do you consider when designing solutions with {{skill}}?",
  "How would you optimize performance for a system built with {{skill}}?",
  "Explain how you would test a feature implemented in {{skill}}."
];

const BEHAVIORAL_TEMPLATES = [
  "Tell me about a time you collaborated with others to deliver a {{skill}}-related project.",
  "Describe a situation where you had to learn {{skill}} quickly.",
  "How do you communicate technical decisions involving {{skill}} to non-technical stakeholders?",
  "Share an example of handling failure while working on {{skill}}.",
  "How do you prioritize tasks when multiple {{skill}} deadlines overlap?"
];

const LEVELS = ["easy", "medium", "hard"];

const normalizeText = (text) => (text || "").toLowerCase();

const detectSkills = (text) => {
  const normalized = normalizeText(text);
  const found = KNOWN_SKILLS.filter((skill) => normalized.includes(skill));
  return found.length ? found : ["problem-solving", "communication"];
};

const detectEducation = (text) => {
  const normalized = normalizeText(text);
  if (normalized.includes("phd") || normalized.includes("doctorate")) return "Doctorate";
  if (normalized.includes("master")) return "Master's Degree";
  if (normalized.includes("bachelor")) return "Bachelor's Degree";
  return "Not specified";
};

const detectExperience = (text) => {
  const match = text?.match(/(\d+)\+?\s+years?/i);
  if (match) return `${match[1]} years`;
  return "Experience duration not explicitly stated";
};

export const analyzeResumeText = (resumeText) => {
  const skills = detectSkills(resumeText);
  return {
    skills,
    experience: detectExperience(resumeText),
    education: detectEducation(resumeText),
    strengths: skills.slice(0, 3).map((skill) => `Demonstrated applied ${skill} experience`)
  };
};

export const generateInterviewQuestions = (analysis, count = 10) => {
  const safeCount = Math.max(1, Math.min(10, count || 10));
  const skills = analysis.skills?.length ? analysis.skills : ["general engineering"];

  return Array.from({ length: safeCount }, (_, index) => {
    const type = index % 2 === 0 ? "technical" : "behavioral";
    const relatedSkill = skills[index % skills.length];
    const templates = type === "technical" ? TECHNICAL_TEMPLATES : BEHAVIORAL_TEMPLATES;
    const template = templates[index % templates.length];

    return {
      question: template.replaceAll("{{skill}}", relatedSkill),
      type,
      difficulty: LEVELS[index % LEVELS.length],
      relatedSkill
    };
  });
};

export const evaluateInterviewAnswer = ({ question, answer, relatedSkill }) => {
  const answerText = (answer || "").trim();
  const answerLength = answerText.split(/\s+/).filter(Boolean).length;
  const mentionsSkill = relatedSkill ? normalizeText(answerText).includes(normalizeText(relatedSkill)) : false;
  const mentionsQuestionKeyword = normalizeText(answerText).includes(normalizeText(question).split(" ")[0]);

  let score = 4;
  if (answerLength >= 30) score += 2;
  if (answerLength >= 80) score += 1;
  if (mentionsSkill) score += 2;
  if (mentionsQuestionKeyword) score += 1;

  score = Math.max(1, Math.min(10, score));

  return {
    score,
    clarity: answerLength >= 30 ? "Clear structure with useful detail" : "Needs more structured detail",
    relevance: mentionsSkill ? "Strongly related to the asked skill" : "Could be more tied to the asked topic",
    confidence: answerLength >= 20 ? "Confident tone" : "Add more decisive examples",
    technicalAccuracy: mentionsSkill ? "Shows technical grounding" : "Include concrete technical evidence",
    suggestions: [
      "Use the STAR format (Situation, Task, Action, Result).",
      "Quantify outcomes where possible.",
      "Tie the answer back to job requirements."
    ]
  };
};
