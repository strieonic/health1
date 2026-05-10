import express from "express";
import {
  getPatientProfile,
  updateMedicalProfile,
  addFamilyMember,
  getFamilyMembers,
  removeFamilyMember,
  updateFamilyMedical,
  getMyRecords,
  getMyConsents,
  getHealthCard,
} from "../controllers/patientController.js";

import { protectPatient } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ======================================================
   🔐 PROTECTED ROUTES
====================================================== */
router.use(protectPatient);

/* ======================================================
   👤 PROFILE
====================================================== */
router.get("/profile", getPatientProfile);
router.put("/profile/update-medical", updateMedicalProfile);

/* ======================================================
   👨‍👩‍👧 FAMILY MANAGEMENT
====================================================== */
router.post("/family/add", addFamilyMember);
router.get("/family", getFamilyMembers);
router.delete("/family/:memberId", removeFamilyMember);
router.put("/family/:memberId/medical", updateFamilyMedical);

/* ======================================================
   📄 RECORDS & CONSENTS
====================================================== */
router.get("/records", getMyRecords);
router.get("/consents", getMyConsents);

/* ======================================================
   🚑 HEALTH CARD
====================================================== */
router.get("/healthcard", getHealthCard);

export default router;
