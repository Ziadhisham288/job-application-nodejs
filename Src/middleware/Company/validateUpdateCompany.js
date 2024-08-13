import { updateCompanyJoiSchema } from "../../modules/Company/Company.validation.js";
import customError from "../../Utils/CustomErrors.js";
import { handleAsyncError } from "../asyncHandler.js";

// middleware for validation of updating a company based on a joi schema 


export const validateUpdateCompany = handleAsyncError(async (req, res, next) => {
  const {
    companyName,
    description,
    industry,
    address,
    numberOfEmployees,
    companyEmail,
  } = req.body;

  const result = updateCompanyJoiSchema.validate(
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