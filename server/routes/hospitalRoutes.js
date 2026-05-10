import express from "express";
import {
  getHospitalProfile,
  searchPatientByHealthId,
  getHospitalPatients,
} from "../controllers/hospitalController.js";

import { protectHospital } from "../middleware/hospitalAuth.js";

const router = express.Router();

/* =========================
   ALL HOSPITAL ROUTES PROTECTED
========================= */
router.use(protectHospital);

/* =========================
   PROFILE
========================= */
router.get("/profile", getHospitalProfile);

/* =========================
   SEARCH PATIENT BY HEALTH ID
========================= */
router.post("/search-patient", searchPatientByHealthId);

/* =========================
   HOSPITAL DIRECTORY
========================= */
router.get("/patients", getHospitalPatients);

export default router;
