import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      console.log(req.headers.authorization);
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded);
      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Unauthorized - No Token Provided" });
  }
};
