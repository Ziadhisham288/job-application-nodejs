import customError from "../../Utils/CustomErrors.js";
import { handleAsyncError } from "../asyncHandler.js";

// Checks if the user role is Company_HR if yes => authorize to continue 

export const authorizeCompany = handleAsyncError( async (req, res, next) => {
  const {role} = req.user

  if(role !== "Company_HR")
    return next(new customError("Not authorized, You dont have a company HR account", 401))

  next()
})