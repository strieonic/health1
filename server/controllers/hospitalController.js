import Hospital from "../models/Hospital.js";
import HospitalPatient from "../models/HospitalPatient.js";
import Patient from "../models/Patient.js";

/* =========================
   🏥 PROFILE
========================= */
export const getHospitalProfile = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.hospital._id).select(
      "-password",
    );

    res.status(200).json(hospital);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

/* =========================
   🔎 SEARCH PATIENT (BY HEALTH ID)
========================= */
export const searchPatientByHealthId = async (req, res) => {
  try {
    const { healthId } = req.body;

    const patient = await Patient.findOne({ healthId }).select(
      "name healthId phone bloodGroup emergencyContact",
    );

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // 🧠 AUTO SAVE TO HOSPITAL DIRECTORY
    await HospitalPatient.findOneAndUpdate(
      {
        hospitalId: req.hospital._id,
        patientId: patient._id,
      },
      {
        hospitalId: req.hospital._id,
        patientId: patient._id,
        patientName: patient.name,
        phone: patient.phone,
        lastVisit: new Date(),
      },
      {
        upsert: true,
        returnDocument: "after", // 🔥 replaces "new: true"
      },
    );

    res.status(200).json(patient);
  } catch (err) {
    res.status(500).json({ message: "Search failed" });
  }
};

/* =========================
   📁 HOSPITAL PATIENT DIRECTORY
========================= */
export const getHospitalPatients = async (req, res) => {
  try {
    const data = await HospitalPatient.find({
      hospitalId: req.hospital._id,
    })
      .populate("patientId", "name healthId bloodGroup phone emergencyContact")
      .sort({ lastVisit: -1 }); // 🔥 latest first

    res.status(200).json({
      total: data.length,
      patients: data,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch patients" });
  }
};
