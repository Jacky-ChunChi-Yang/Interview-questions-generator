export default function Dashboard({ overallScore, analysis, questions, feedbackMap }) {
  const strongSkills = analysis?.skills?.slice(0, 3) || [];
  const weakAreas = Object.entries(feedbackMap)
    .filter(([, item]) => item.score < 7)
    .map(([index, item]) => `${questions[index]?.relatedSkill || "General"}: ${item.suggestions[0]}`);

  const feedbackSummary = Object.values(feedbackMap)
    .slice(-3)
    .map((item) => `${item.score}/10 - ${item.relevance}`);

  const recommendedTopics = weakAreas.length
    ? weakAreas.map((entry) => entry.split(":")[0])
    : ["System design", "Behavioral storytelling", "Testing strategies"];

  return (
    <section>
      <h2>Interview Dashboard</h2>
      <p>Overall interview score: {overallScore.toFixed(1)} / 10</p>

      <h3>Strong Skills</h3>
      <ul>{strongSkills.map((skill) => <li key={skill}>{skill}</li>)}</ul>

      <h3>Weak Areas</h3>
      <ul>{weakAreas.map((area) => <li key={area}>{area}</li>)}</ul>

      <h3>Question History</h3>
      <ul>
        {questions.map((q, index) => (
          <li key={`${q.question}-${index}`}>
            [{q.type} / {q.difficulty}] {q.question}
          </li>
        ))}
      </ul>

      <h3>Feedback Summary</h3>
      <ul>{feedbackSummary.map((item) => <li key={item}>{item}</li>)}</ul>

      <h3>Recommended Topics to Practice</h3>
      <ul>{recommendedTopics.map((topic) => <li key={topic}>{topic}</li>)}</ul>
    </section>
  );
}
