import dotenv from "dotenv";
dotenv.config();
import "./config/cloudinary.js";
console.log("EMAIL_USER =", process.env.EMAIL_USER);
console.log("EMAIL_PASS =", process.env.EMAIL_PASS);
console.log("Cloudinary ENV:", process.env.CLOUD_NAME);
console.log("Cloudinary ENV:", process.env.CLOUD_API_KEY);
console.log("Cloudinary ENV:", process.env.CLOUD_API_SECRET);
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectDB from "./config/db.js";
import medicalRecordRoutes from "./routes/recordRoutes.js";
import consentRoutes from "./routes/consentRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import hospitalRoutes from "./routes/hospitalRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";
const app = express();

/* ======================================================
   MIDDLEWARE
====================================================== */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* ======================================================
   CORS FIX
====================================================== */
const allowedOrigins = ["http://localhost:5173"];

app.use(
  cors({
    origin: true, // Allow all origins in dev
    credentials: true,
  }),
);

app.use("/api/patient", patientRoutes);

app.use("/api/hospital", hospitalRoutes);

app.use("/api/consent", consentRoutes);
app.use("/api/records", medicalRecordRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/public", publicRoutes);
const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    console.log("⏳ Connecting MongoDB...");
    await connectDB();
    console.log("✅ MongoDB connected");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
