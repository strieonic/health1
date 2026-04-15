import express from "express";
import { memoryUpload } from "../middleware/uploadMiddleware.js";

import {
  uploadRecord,
  getPatientRecords,
} from "../controllers/recordController.js";

import { protectHospital } from "../middleware/hospitalAuth.js";

const router = express.Router();

/* =========================
   UPLOAD MEDICAL RECORD
========================= */
router.post(
  "/upload",
  protectHospital,
  memoryUpload.single("file"),
  uploadRecord,
);

/* =========================
   GET PATIENT RECORDS
========================= */
router.get("/:healthId", protectHospital, getPatientRecords);

export default router;
