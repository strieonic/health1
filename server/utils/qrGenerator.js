import QRCode from "qrcode";

const generateQR = async (healthId) => {
  return await QRCode.toDataURL(healthId);
};

export default generateQR;
