import express from "express";
import {
  requestConsent,
  verifyConsentOTP,
} from "../controllers/consentController.js";

import { protectHospital } from "../middleware/hospitalAuth.js";

const router = express.Router();

/* =========================
   REQUEST CONSENT (OTP)
========================= */
router.post("/request", protectHospital, requestConsent);

/* =========================
   VERIFY OTP (GRANT ACCESS)
========================= */
router.post("/verify", protectHospital, verifyConsentOTP);

export default router;
