import pkg from "pg";

const { Pool } = pkg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://localhost:5432/interview_platform"
});
