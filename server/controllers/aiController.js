import axios from "axios";
import MedicalRecord from "../models/MedicalRecord.js";
import pdf from "pdf-parse";

/**
 * AI ANALYZE FROM DATABASE RECORD (BEST APPROACH)
 */
export const analyzeMedicalReport = async (req, res) => {
  try {
    const { recordId } = req.params;

    if (!recordId) {
      return res.status(400).json({ message: "recordId is required" });
    }

    // 1. Get record from DB
    const record = await MedicalRecord.findById(recordId);

    if (!record) {
      return res.status(404).json({ message: "Medical record not found" });
    }

    if (!record.fileUrl) {
      return res.status(400).json({ message: "No file attached" });
    }

    // 2. Download PDF from Cloudinary
    const fileResponse = await axios.get(record.fileUrl, {
      responseType: "arraybuffer",
    });

    const buffer = Buffer.from(fileResponse.data);

    // 3. Extract text from PDF
    const pdfData = await pdf(buffer);
    const text = pdfData.text;

    if (!text || text.length < 30) {
      return res.status(400).json({
        message: "Could not extract meaningful text",
      });
    }

    // 4. Groq Prompt
    const prompt = `
You are a medical assistant for Indian patients.

Explain this report in simple language:

1. Summary
2. Abnormal findings
3. Normal findings
4. Risk analysis
5. Lifestyle advice

Rules:
- No prescriptions
- Simple English
- Be safe and cautious

REPORT:
${text}
`;

    // 5. Call Groq API
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-70b-versatile",
        messages: [
          {
            role: "system",
            content:
              "You are a careful medical report assistant for non-doctors.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    const result = response.data.choices[0].message.content;

    return res.status(200).json({
      message: "AI analysis successful",
      result,
    });
  } catch (err) {
    console.error(
      "🔥 AI ERROR FULL:",
      err?.response?.data || err.message || err,
    );

    return res.status(500).json({
      message: "AI analysis failed",
      error: err?.response?.data || err.message,
    });
  }
};
