import { addJobJoiSchema } from "../../modules/Job/Job.validation.js";
import customError from "../../Utils/CustomErrors.js";
import { handleAsyncError } from "../asyncHandler.js";

// middleware for validation of adding a job based on a joi schema 


export const valdiateAddJob = handleAsyncError(async (req, res, next) => {
  const {
    jobTitle,
    jobLocation,
    workingTime,
    senorityLevel,
    jobDescription,
    technicalSkills,
    softSkills
  } = req.body;

  const result = addJobJoiSchema.validate(
    {
      jobTitle,
      jobLocation,
      workingTime,
      senorityLevel,
      jobDescription,
      technicalSkills,
      softSkills
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
