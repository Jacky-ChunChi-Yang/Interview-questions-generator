# AI-Powered Interview Preparation Platform

A full-stack application where users upload resumes, receive AI-driven resume analysis, practice generated interview questions, and get instant feedback with weakness-focused recommendations.

## Features

- Resume upload (PDF/DOCX) from React frontend
- Resume analysis API extracting:
  - Skills
  - Experience
  - Education
  - Job-related strengths
- Interview question generation (10 questions) with:
  - `type` (technical/behavioral)
  - `difficulty`
  - `relatedSkill`
- Answer evaluation API returning:
  - `score` (1-10)
  - Clarity
  - Relevance
  - Confidence
  - Technical accuracy
  - Improvement suggestions
- Dashboard showing:
  - Overall interview score
  - Strong skills
  - Weak areas
  - Question history
  - Feedback summary
  - Recommended practice topics

## Tech Stack

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Database:** PostgreSQL (`backend/src/db/schema.sql`)

## Project Structure

```text
backend/
  src/
    app.js
    server.js
    routes/interview.js
    services/
      aiService.js
      resumeParser.js
    config/db.js
    db/schema.sql
  test/aiService.test.js
frontend/
  src/
    App.jsx
    api.js
    main.jsx
    components/
      ResumeUpload.jsx
      Dashboard.jsx
```

## Installation

### 1) Backend setup

```bash
cd /tmp/workspace/Jacky-ChunChi-Yang/Interview-questions-generator/backend
npm install
npm start
```

Backend runs at `http://localhost:4000`.

### 2) Frontend setup

```bash
cd /tmp/workspace/Jacky-ChunChi-Yang/Interview-questions-generator/frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

### 3) PostgreSQL setup

Create a database and apply:

```bash
psql -d interview_platform -f /tmp/workspace/Jacky-ChunChi-Yang/Interview-questions-generator/backend/src/db/schema.sql
```

Optionally set backend environment variable:

```bash
export DATABASE_URL="postgresql://localhost:5432/interview_platform"
```

## Usage

1. Upload a PDF or DOCX resume.
2. Review AI resume analysis.
3. Generate 10 interview questions.
4. Submit answers to receive AI feedback and score.
5. Use dashboard insights to focus practice.

## API Endpoints

### `POST /api/resume/analyze`
Upload form-data file field `resume`.

Response:

```json
{
  "analysis": {
    "skills": ["react", "node.js"],
    "experience": "5 years",
    "education": "Bachelor's Degree",
    "strengths": ["Demonstrated applied react experience"]
  }
}
```

### `POST /api/questions/generate`

Request:

```json
{
  "analysis": {
    "skills": ["react", "node.js"]
  },
  "count": 10
}
```

Response:

```json
{
  "questions": [
    {
      "question": "How have you used react in production projects?",
      "type": "technical",
      "difficulty": "easy",
      "relatedSkill": "react"
    }
  ]
}
```

### `POST /api/answers/evaluate`

Request:

```json
{
  "question": "How do you test React components?",
  "answer": "I use React Testing Library...",
  "relatedSkill": "react"
}
```

Response:

```json
{
  "feedback": {
    "score": 8,
    "clarity": "Clear structure with useful detail",
    "relevance": "Strongly related to the asked skill",
    "confidence": "Confident tone",
    "technicalAccuracy": "Shows technical grounding",
    "suggestions": [
      "Use the STAR format (Situation, Task, Action, Result)."
    ]
  }
}
```

## Future Improvements

- Integrate production LLM provider for advanced semantic feedback
- Add authentication and per-user progress tracking
- Add persistent dashboard analytics and trend lines
- Add voice interview simulation and follow-up questioning
