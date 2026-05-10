import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // 🔥 FIX: Force IPv4 to avoid ENETUNREACH on environments that don't support IPv6 correctly
  family: 4,
});

transporter
  .verify()
  .then(() => console.log("SMTP READY"))
  .catch((err) => console.log("SMTP ERROR:", err));

const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Arogyam" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("Email Sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("Email Error:", error);
    return false;
  }
};

export default sendEmail;
