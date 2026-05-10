import otpGenerator from "otp-generator";
import OTP from "../models/OTP.js";
import sendEmail from "./sendEmail.js";

export const generateOTP = async (patientId, email) => {
  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
  });

  const expires = new Date(Date.now() + 5 * 60 * 1000);

  await OTP.create({
    patient: patientId,
    otp,
    expiresAt: expires,
  });

  console.log(`\n========================================\nDEBUG: OTP for ${email} is: ${otp}\n========================================\n`);

  // 🔥 FIX: Don't await the email send. 
  // Let it happen in the background so the user isn't stuck.
  sendEmail(
    email,
    "Arogyam OTP",
    `<h2>Your OTP is ${otp}</h2><p>Valid for 5 minutes</p>`,
  ).catch(err => console.error("Background Email Error:", err));

  return otp;
};
