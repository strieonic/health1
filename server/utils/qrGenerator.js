import QRCode from "qrcode";

const generateQR = async (arogyamId) => {
  return await QRCode.toDataURL(arogyamId);
};

export default generateQR;
