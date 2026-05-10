import mongoose from "mongoose";
const consentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
      index: true,
    },

    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
      index: true,
    },

    otp: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    accessStart: Date,

    accessEnd: Date,

    accessType: {
      type: String,
      enum: ["VIEW", "UPLOAD", "FULL"],
      default: "VIEW",
    },

    // ⭐ IMPORTANT (security improvement)
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);
export default mongoose.model("Consent", consentSchema);
