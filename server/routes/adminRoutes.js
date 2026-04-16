import express from "express";
import { adminLogin } from "../controllers/adminController.js";
import { protectAdmin } from "../middleware/adminMiddleware.js";
import {
  getAllHospitals,
  getHospitalDetails,
  approveHospital,
  rejectHospital,
  getAdminStats,
  getAllPatients,
  getAllRecords,
  getAllConsents,
} from "../controllers/adminController.js";

const router = express.Router();

/* ======================================================
   ADMIN LOGIN
====================================================== */
router.post("/login", adminLogin);

router.get("/hospitals", protectAdmin, getAllHospitals);
router.get("/hospitals/:id", protectAdmin, getHospitalDetails);

router.put("/hospitals/:id/approve", protectAdmin, approveHospital);
router.put("/hospitals/:id/reject", protectAdmin, rejectHospital);

router.get("/stats", protectAdmin, getAdminStats);
router.get("/patients", protectAdmin, getAllPatients);
router.get("/records", protectAdmin, getAllRecords);
router.get("/consents", protectAdmin, getAllConsents);

export default router;
