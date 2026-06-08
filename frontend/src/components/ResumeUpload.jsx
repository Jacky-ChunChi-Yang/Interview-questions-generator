import { useState } from "react";
import { analyzeResume } from "../api";

const acceptedTypes = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
];

export default function ResumeUpload({ onAnalyzed }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!file) return;

    setLoading(true);
    setError("");
    try {
      const result = await analyzeResume(file);
      onAnalyzed(result.analysis);
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <h2>Upload Resume</h2>
      <input
        type="file"
        accept=".pdf,.docx"
        onChange={(event) => {
          const selected = event.target.files?.[0];
          if (selected && (acceptedTypes.includes(selected.type) || selected.name.endsWith(".docx"))) {
            setFile(selected);
            setError("");
          } else {
            setFile(null);
            setError("Please upload a PDF or DOCX file.");
          }
        }}
      />
      <button type="submit" disabled={!file || loading}>
        {loading ? "Analyzing..." : "Analyze Resume"}
      </button>
      {error && <p>{error}</p>}
    </form>
  );
}
