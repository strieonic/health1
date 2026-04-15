import fs from "fs";
import Tesseract from "tesseract.js";
import pdfPoppler from "pdf-poppler";

/* ======================================================
   ALWAYS USE OCR FOR PDFs (NO pdf-parse)
====================================================== */
export const extractTextFromPDF = async (filePath) => {
  try {
    const outputDir = "uploads/converted";

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const options = {
      format: "png",
      out_dir: outputDir,
      out_prefix: "page",
      page: 1, // first page is enough for license validation
    };

    console.log("📄 Converting PDF → Image...");
    await pdfPoppler.convert(filePath, options);

    const imagePath = `${outputDir}/page-1.png`;

    console.log("🔎 Running OCR...");
    const result = await Tesseract.recognize(imagePath, "eng", {
      logger: (m) => console.log("OCR:", m.status),
    });

    // cleanup temp image
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);

    return result.data.text || "";
  } catch (error) {
    console.log("OCR extraction error:", error.message);
    return "";
  }
};

/* ======================================================
   IMAGE OCR (for doctor uploads later)
====================================================== */
export const extractTextFromImage = async (imagePath) => {
  try {
    const result = await Tesseract.recognize(imagePath, "eng", {
      logger: (m) => console.log("OCR:", m.status),
    });

    return result.data.text || "";
  } catch (error) {
    console.log("Image OCR error:", error.message);
    return "";
  }
};
