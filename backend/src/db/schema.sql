CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS resume_analyses (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  raw_text TEXT NOT NULL,
  skills JSONB NOT NULL,
  experience TEXT,
  education TEXT,
  strengths JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS question_history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  related_skill TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS answer_feedback (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  question_id INTEGER REFERENCES question_history(id),
  answer_text TEXT NOT NULL,
  score INTEGER NOT NULL,
  feedback JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
