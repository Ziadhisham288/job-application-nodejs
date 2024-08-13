import userJoiSchema from "../../../modules/User/User.validation.js";
import customError from "../../../Utils/CustomErrors.js";
import { handleAsyncError } from "../../asyncHandler.js";

// middleware for validation of adding user data based on a joi schema 


export const validateUserData = handleAsyncError(async (req, res , next) => {
  const result = userJoiSchema.validate(req.body, {abortEarly: false})

  if (result.error) 
    return next(new customError(result.error?.details.map(error => error.message), 400))

  next()
})