import { User } from "../../../../Database/models/User.model.js";
import customError from "../../../Utils/CustomErrors.js";
import { handleAsyncError } from "../../asyncHandler.js";

// Middleware to check if user exists already in database by email or mobile number 

export const checkEmailAndMobile = handleAsyncError(async (req, res, next) => {
  const {email, mobileNumber} = req.body;

  const userByEmail = await User.findOne({email})
  const userByMobileNumber = await User.findOne({mobileNumber})


  if(userByEmail)
    return next(new customError("Email already exists", 409))

  if(userByMobileNumber)
    return next(new customError("Mobile number already exists", 409))
  
  next()
})