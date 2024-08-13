import { handleAsyncError } from "../../asyncHandler.js";
import bcrypt from "bcryptjs";

// Middleware to hash the user password before storing it in the database

export const hashPassword = handleAsyncError(async (req, res, next) => {
  let { password } = req.body;

  let hashedPassword = bcrypt.hashSync(password, 10);

  password = hashedPassword;

  req.body = {
    ...req.body,
    password
  };

  next()
});
