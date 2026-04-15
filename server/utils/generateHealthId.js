const generateHealthId = (input) => {
  // convert safely to string
  const str = String(input || Date.now());

  const last4 = str.slice(-4);
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();

  return `HID${last4}${random}`;
};

export default generateHealthId;
