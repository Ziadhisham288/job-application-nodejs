import { handleAsyncError } from "../asyncHandler.js";
import Company from './../../../Database/models/Company.model.js';

// Middleware to check if the company already exists in database by company name or company email

export const checkCompanyExists = handleAsyncError(async (req,res,next) => {
  const {companyName, companyEmail} = req.body;

  const existingCompany = await Company.findOne({
    $or: [{ companyName }, { companyEmail }],
  });

  if (existingCompany) {
    if (existingCompany.companyName === companyName)
      return next(new customError("Company name already exists", 409));

    if (existingCompany.companyEmail === companyEmail)
      return next(new customError("Company email already exists", 409));
  }

  next()
})