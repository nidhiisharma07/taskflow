import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: token missing"
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: user not found"
      });
    }

    req.user = user; // 🔥 full DB user
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: invalid token"
    });
  }
};

export default authMiddleware;