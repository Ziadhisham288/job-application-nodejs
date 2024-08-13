import customError from "../../Utils/CustomErrors.js";
import { handleAsyncError } from "../asyncHandler.js";
import { addCompanyJoiSchema } from '../../modules/Company/Company.validation.js';

// middleware for validation of adding a company based on a joi schema 

export const validateAddCompany = handleAsyncError(async (req, res, next) => {
  const {
    companyName,
    description,
    industry,
    address,
    numberOfEmployees,
    companyEmail,
  } = req.body;

  const result = addCompanyJoiSchema.validate(
    {
      companyName,
      description,
      industry,
      address,
      numberOfEmployees,
      companyEmail,
    },
    { abortEarly: false }
  );

  if (result.error)
    return next(
      new customError(
        result.error?.details.map((error) => error.message),
        400
      )
    );

  next();
});
