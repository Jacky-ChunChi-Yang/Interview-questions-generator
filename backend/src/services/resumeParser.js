import path from "path";
import pdf from "pdf-parse";
import mammoth from "mammoth";

const isPdf = (file) =>
  file.mimetype === "application/pdf" || path.extname(file.originalname).toLowerCase() === ".pdf";

const isDocx = (file) => {
  const extension = path.extname(file.originalname).toLowerCase();
  return (
    file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    extension === ".docx"
  );
};

export const extractTextFromResume = async (file) => {
  if (isPdf(file)) {
    const parsed = await pdf(file.buffer);
    return parsed.text;
  }

  if (isDocx(file)) {
    const parsed = await mammoth.extractRawText({ buffer: file.buffer });
    return parsed.value;
  }

  throw new Error("Only PDF or DOCX files are supported");
};
