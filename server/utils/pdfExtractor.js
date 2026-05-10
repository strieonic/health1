import pdf from "pdf-parse";

export const extractTextFromPDF = async (buffer) => {
  try {
    const data = await pdf(buffer);
    return data.text;
  } catch (err) {
    throw new Error("PDF parsing failed");
  }
};
