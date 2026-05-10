import mongoose from "mongoose";
const medicalRecordSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },

  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital",
    required: true,
  },

  recordType: {
    type: String,
    enum: ["LAB", "XRAY", "PRESCRIPTION", "REPORT"],
    required: true,
  },

  fileUrl: String,
  notes: String,

  // ⭐ OPTIONAL BUT USEFUL (audit/security)
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital",
  },

  createdAt: { type: Date, default: Date.now },
});
export default mongoose.model("MedicalRecord", medicalRecordSchema);
