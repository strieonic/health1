import Patient from "../models/Patient.js";
import Hospital from "../models/Hospital.js";
import MedicalRecord from "../models/MedicalRecord.js";

export const getStats = async (req, res) => {
  try {
    const patientCount = await Patient.countDocuments();
    const hospitalCount = await Hospital.countDocuments();
    const recordCount = await MedicalRecord.countDocuments();

    res.status(200).json({
      patients: 12000 + patientCount, // Base numbers from UI + real data
      hospitals: 50 + hospitalCount,
      statesCovered: 28,
      uptime: 99.9,
      totalRecords: recordCount
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stats", error: err.message });
  }
};
