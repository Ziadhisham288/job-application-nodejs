import customError from "../../Utils/CustomErrors.js";
import { handleAsyncError } from "../asyncHandler.js";
import jwt from "jsonwebtoken";

// Authenticate users by verifying the JWT

export const verifyToken = handleAsyncError(async (req, res, next) => {
  const { token } = req.headers;

  if (!token) {
    return next(new customError("No token found", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return next(new customError("Invalid or expired token", 401));
  }
});
