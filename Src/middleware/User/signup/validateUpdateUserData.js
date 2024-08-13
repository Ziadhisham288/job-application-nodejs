import { updateUserJoiSchema } from "../../../modules/User/User.validation.js";
import customError from "../../../Utils/CustomErrors.js";
import { handleAsyncError } from "../../asyncHandler.js";

// middleware for validation of updating user data based on a joi schema 


export const validateUpdateUserData = handleAsyncError(async (req, res , next) => {
  const result = updateUserJoiSchema.validate(req.body, {abortEarly: false})

  if (result.error) 
    return next(new customError(result.error?.details.map(error => error.message), 400))

  next()
})