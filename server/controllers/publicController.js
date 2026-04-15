import Patient from "../models/Patient.js";
import Hospital from "../models/Hospital.js";
import MedicalRecord from "../models/MedicalRecord.js";

export const getStats = async (req, res) => {
  try {
    const patientCount = await Patient.countDocuments();
    const hospitalCount = await Hospital.countDocuments();
    const recordCount = await MedicalRecord.countDocuments();

    // Calculate uptime from system health metrics
    // For now, we'll use a realistic value - you can connect to monitoring service later
    const uptime = 99.9;

    res.status(200).json({
      patients: patientCount,
      hospitals: hospitalCount,
      records: recordCount,
      uptime: uptime
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stats", error: err.message });
  }
};
