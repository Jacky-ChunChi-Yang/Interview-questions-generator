import { useMemo, useState } from "react";
import { evaluateAnswer, generateQuestions } from "./api";
import ResumeUpload from "./components/ResumeUpload";
import Dashboard from "./components/Dashboard";

export default function App() {
  const [analysis, setAnalysis] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [feedbackMap, setFeedbackMap] = useState({});
  const [error, setError] = useState("");

  const overallScore = useMemo(() => {
    const values = Object.values(feedbackMap).map((entry) => entry.score);
    if (!values.length) return 0;
    return values.reduce((sum, score) => sum + score, 0) / values.length;
  }, [feedbackMap]);

  const createQuestions = async () => {
    if (!analysis) return;
    setError("");
    try {
      const result = await generateQuestions(analysis);
      setQuestions(result.questions);
    } catch (err) {
      setError(err.message || "Failed to generate questions");
    }
  };

  const submitAnswer = async (index) => {
    const question = questions[index];
    const answer = answers[index];
    if (!answer) return;

    try {
      const result = await evaluateAnswer({
        question: question.question,
        relatedSkill: question.relatedSkill,
        answer
      });
      setFeedbackMap((prev) => ({ ...prev, [index]: result.feedback }));
    } catch (err) {
      setError(err.message || "Failed to evaluate answer");
    }
  };

  return (
    <main>
      <h1>AI Interview Preparation Platform</h1>
      <ResumeUpload onAnalyzed={setAnalysis} />

      {analysis && (
        <section>
          <h2>Resume Analysis</h2>
          <p>Experience: {analysis.experience}</p>
          <p>Education: {analysis.education}</p>
          <p>Skills: {analysis.skills.join(", ")}</p>
          <button onClick={createQuestions}>Generate 10 Questions</button>
        </section>
      )}

      {questions.length > 0 && (
        <section>
          <h2>Practice Questions</h2>
          {questions.map((question, index) => (
            <article key={`${question.question}-${index}`}>
              <p>
                <strong>{index + 1}.</strong> {question.question}
              </p>
              <textarea
                rows={3}
                placeholder="Write your answer"
                value={answers[index] || ""}
                onChange={(event) => setAnswers((prev) => ({ ...prev, [index]: event.target.value }))}
              />
              <button onClick={() => submitAnswer(index)}>Get AI Feedback</button>
              {feedbackMap[index] && <p>Score: {feedbackMap[index].score}/10</p>}
            </article>
          ))}
        </section>
      )}

      {(questions.length > 0 || analysis) && (
        <Dashboard
          overallScore={overallScore}
          analysis={analysis || { skills: [] }}
          questions={questions}
          feedbackMap={feedbackMap}
        />
      )}

      {error && <p>{error}</p>}
    </main>
  );
}
