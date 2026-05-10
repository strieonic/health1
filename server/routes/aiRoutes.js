import express from "express";
import { analyzeMedicalReport } from "../controllers/aiController.js";

const router = express.Router();

// NEW: uses recordId instead of fileUrl
router.post("/analyze-report/:recordId", analyzeMedicalReport);

export default router;
