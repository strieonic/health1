import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Use TLS for port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  family: 4,
  connectionTimeout: 5000,
  greetingTimeout: 5000,
  socketTimeout: 5000,
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
