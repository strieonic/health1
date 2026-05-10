import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema(
  {
    hospitalName: { type: String, required: true },
    regNumber: { type: String, required: true, unique: true },

    address: String,

    email: { type: String, required: true, unique: true },
    phone: String,

    password: { type: String, required: true },
    licencePdf: String,

    role: {
      type: String,
      default: "HOSPITAL",
    },

    trustScore: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    verifiedByAdmin: { type: Boolean, default: false },

    // ⭐ system improvements
    lastLogin: Date,

    isActive: {
      type: Boolean,
      default: true,
    },

    consentRequestsToday: {
      type: Number,
      default: 0,
    },

    blockedUntil: Date,
  },
  { timestamps: true },
);

/* SECURITY FIX */
hospitalSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model("Hospital", hospitalSchema);
