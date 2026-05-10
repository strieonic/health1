import dotenv from "dotenv";
dotenv.config();
import "./config/cloudinary.js";
// Environment variables loaded
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
   CORS CONFIGURATION (PRODUCTION SAFE)
====================================================== */
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/$/, "") : null,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`🛑 CORS Blocked: ${origin}. Add this to FRONTEND_URL in Render.`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

/* ======================================================
   HEALTH CHECK & ROOT ROUTES
====================================================== */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Arogyam API Running",
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
  });
});

/* ======================================================
   API ROUTES
====================================================== */
app.use("/api/patient", patientRoutes);
app.use("/api/hospital", hospitalRoutes);
app.use("/api/consent", consentRoutes);
app.use("/api/records", medicalRecordRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/ai", aiRoutes);

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
