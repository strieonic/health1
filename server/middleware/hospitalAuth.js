import jwt from "jsonwebtoken";
import Hospital from "../models/Hospital.js";

export const protectHospital = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Hospital not authorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.hospital = await Hospital.findById(decoded.id).select("-password");

    next();
  } catch (error) {
    res.status(401).json({ message: "Hospital token failed" });
  }
};
