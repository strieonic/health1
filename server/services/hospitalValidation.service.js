const hospitalRegex = /^[A-Z]{2}-\d{5}-\d{4}$/;
const doctorRegex = /^[A-Z]{2,4}\/\d{4}\/\d{4,6}$/;

export const validateHospitalData = async ({
  regNumber,
  doctors,
  licenseText,
  email,
}) => {
  let score = 0;

  // ✅ REG NUMBER
  if (hospitalRegex.test(regNumber)) score += 30;

  // ✅ DOCTOR LICENSE
  const doctorValid = doctors?.every((d) => doctorRegex.test(d.licenseNumber));
  if (doctorValid) score += 30;

  // ✅ OCR VALIDATION
  const text = licenseText.toLowerCase();

  const mustHaveKeywords = ["hospital", "license"];
  const optionalKeywords = ["registration", "government"];

  const mustMatch = mustHaveKeywords.every((w) => text.includes(w));
  const optionalMatch = optionalKeywords.some((w) => text.includes(w));

  const licenseValid = mustMatch && optionalMatch;

  // 🔥 ADD THIS (IMPORTANT)
  if (licenseValid) {
    score += 30;
  }

  // ❌ NEGATIVE KEYWORDS (VERY IMPORTANT)
  const invalidKeywords = ["rent", "agreement", "lease", "tenant"];
  if (invalidKeywords.some((w) => text.includes(w))) {
    score -= 40;
  }

  // ⚠️ EMAIL PENALTY
  const freeDomains = ["gmail.com", "yahoo.com", "hotmail.com"];
  if (freeDomains.some((d) => email.includes(d))) score -= 10;

  /* 🔥 FINAL DECISION */
  let status = "pending";

  if (score >= 70) status = "approved";
  else if (score < 50) status = "rejected";

  return {
    trustScore: score,
    status,
  };
};
