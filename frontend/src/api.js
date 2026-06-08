const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";

export const analyzeResume = async (file) => {
  const formData = new FormData();
  formData.append("resume", file);

  const response = await fetch(`${API_BASE}/resume/analyze`, {
    method: "POST",
    body: formData
  });

  if (!response.ok) throw new Error("Resume analysis failed");
  return response.json();
};

export const generateQuestions = async (analysis) => {
  const response = await fetch(`${API_BASE}/questions/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ analysis, count: 10 })
  });

  if (!response.ok) throw new Error("Question generation failed");
  return response.json();
};

export const evaluateAnswer = async (payload) => {
  const response = await fetch(`${API_BASE}/answers/evaluate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) throw new Error("Answer evaluation failed");
  return response.json();
};
