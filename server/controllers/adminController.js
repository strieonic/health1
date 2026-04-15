import Hospital from "../models/Hospital.js";
import jwt from "jsonwebtoken";

/* ======================================================
   ADMIN LOGIN
====================================================== */
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    // create admin JWT
    const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "Admin login successful",
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Admin login failed" });
  }
};

/* ======================================================
   GET ALL HOSPITALS (PENDING / APPROVED / REJECTED)
====================================================== */
export const getAllHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find().select("-password");

    res.status(200).json({
      total: hospitals.length,
      hospitals,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch hospitals" });
  }
};
/* ======================================================
   GET SINGLE HOSPITAL DETAILS
====================================================== */
export const getHospitalDetails = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id).select("-password");

    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    res.status(200).json(hospital);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hospital" });
  }
};
/* ======================================================
   APPROVE HOSPITAL
====================================================== */
export const approveHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);

    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    // ✅ Only pending can be approved
    if (hospital.status !== "pending") {
      return res.status(400).json({
        message: `Hospital already ${hospital.status}`,
      });
    }

    hospital.status = "approved";
    hospital.verifiedByAdmin = true;

    await hospital.save();

    res.status(200).json({
      message: "Hospital approved successfully",
      trustScore: hospital.trustScore,
    });
  } catch (error) {
    res.status(500).json({ message: "Approval failed" });
  }
};
/* ======================================================
   REJECT HOSPITAL
====================================================== */
export const rejectHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);

    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    // ✅ Only pending can be rejected
    if (hospital.status !== "pending") {
      return res.status(400).json({
        message: `Hospital already ${hospital.status}`,
      });
    }

    hospital.status = "rejected";
    hospital.verifiedByAdmin = false;

    await hospital.save();

    res.status(200).json({
      message: "Hospital rejected successfully",
      trustScore: hospital.trustScore,
    });
  } catch (error) {
    res.status(500).json({ message: "Rejection failed" });
  }
};
