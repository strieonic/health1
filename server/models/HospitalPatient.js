import mongoose from "mongoose";
const hospitalPatientSchema = new mongoose.Schema(
  {
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
      index: true,
    },

    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
      index: true,
    },

    patientName: String,
    phone: String,
    lastVisit: Date,
  },
  { timestamps: true },
);

// ⭐ Prevent duplicates (VERY IMPORTANT)
hospitalPatientSchema.index({ hospitalId: 1, patientId: 1 }, { unique: true });

export default mongoose.model("HospitalPatient", hospitalPatientSchema);
