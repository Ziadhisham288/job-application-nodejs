import Company from "../../../Database/models/Company.model.js";
import { handleAsyncError } from "../../middleware/asyncHandler.js";
import customError from "../../Utils/CustomErrors.js";
import Job from "./../../../Database/models/Job.model.js";
import Application from './../../../Database/models/Application.model.js';

// creates a new job opening, only company hr is authorized.

export const addJob = handleAsyncError(async (req, res, next) => {
  const { id } = req.user;
  const {
    jobTitle,
    jobLocation,
    workingTime,
    senorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
  } = req.body;

  const job = new Job({
    jobTitle,
    jobLocation,
    workingTime,
    senorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
    addedBy: id,
  });

  job.save();

  res.status(201).json({ message: "Job added successfully", Job: job });
});

// Updates the information of a job, Only the company HR who created the job is authorized to update it.

export const updateJob = handleAsyncError(async (req, res, next) => {
  const { id } = req.user;
  const { jobId } = req.params;
  const {
    jobTitle,
    jobLocation,
    workingTime,
    senorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
  } = req.body;
  let infoToUpdate = {};

  const companyHR = await Job.findOne({ addedBy: id });

  if (!companyHR)
    return next(
      new customError("Only the company HR can update job information", 401)
    );

  if (jobTitle) infoToUpdate.jobTitle = jobTitle;
  if (jobLocation) infoToUpdate.jobLocation = jobLocation;
  if (workingTime) infoToUpdate.workingTime = workingTime;
  if (senorityLevel) infoToUpdate.senorityLevel = senorityLevel;
  if (jobDescription) infoToUpdate.jobDescription = jobDescription;
  if (technicalSkills) infoToUpdate.technicalSkills = technicalSkills;
  if (softSkills) infoToUpdate.softSkills = softSkills;

  const job = await Job.findByIdAndUpdate(jobId, infoToUpdate, {
    new: true,
  });

  res
    .status(200)
    .json({ message: "Job information updated successfully", Job: job });
});

// Deletes a specific job and all its  applications, Only the company HR who created the job can delete it.

export const deleteJob = handleAsyncError(async (req, res, next) => {
  const { id } = req.user;
  const { jobId } = req.params;

  const job = await Job.findOne({ addedBy: id, _id: jobId });

  if (!job) {
    return next(
      new customError(
        "Job not found or you are not authorized to delete this job",
        404
      )
    );
  }

  await Job.findOneAndDelete({ addedBy: id, _id: jobId });
  await Application.deleteMany({jobId});

  res.status(200).json({ message: "Job deleted successfully" });
});

// Gets all available jobs, with the the company information for each job.

export const getAllJobs = handleAsyncError(async (req, res, next) => {
  const jobs = await Job.aggregate([
    {
      $lookup: {
        from: "companies",
        localField: "addedBy",
        foreignField: "companyHR",
        as: "Company",
      },
    },
  ]);

  if (jobs.length === 0)
    return next(new customError("No available jobs currently", 404));

  res.status(200).json({ message: "All jobs available", Jobs: jobs });
});

// Gets all available jobs for a specific company, takes the company name from the query.

export const getCompanyJobs = handleAsyncError(async (req, res, next) => {
  const {company} = req.query;

  const companyInfo = await Company.findOne({companyName : company})

  if(!companyInfo)
    return next(new customError("Company not found", 404))

  const {companyHR} = companyInfo

  const jobsForCompany = await Job.find({addedBy : companyHR})

  if(jobsForCompany.length === 0)
    return next(new customError(`No available jobs for ${companyInfo.companyName}`, 404))


  res.status(200).json({message : `All available jobs for ${companyInfo.companyName}`, jobs: jobsForCompany})
});

// Filters jobs based on provided filters such as job title, location, working time, seniority level, and technical skills.

export const filterJobs = handleAsyncError(async (req, res, next) => {
  const {
    jobTitle,
    jobLocation,
    workingTime,
    senorityLevel,
    technicalSkills
  } = req.body;
  let filters = {};



  if (jobTitle) filters.jobTitle = jobTitle;
  if (jobLocation) filters.jobLocation = jobLocation;
  if (workingTime) filters.workingTime = workingTime;
  if (senorityLevel) filters.senorityLevel = senorityLevel;
  if (technicalSkills && technicalSkills.length > 0) {
    filters.technicalSkills = { $in: technicalSkills }; 
  }

  const jobs = await Job.find(filters);

  if(jobs.length === 0)
    return next(new customError("No jobs found matching your filters", 404))

  res
    .status(200)
    .json({ message: "Available jobs matching your filters", Jobs: jobs });
});

// Allows a user to apply for a specific job, including uploading their resume, technical and soft skills.

export const applyToJob = handleAsyncError(async (req,res , next) => {
  const {id} = req.user;
  const {jobId} = req.params;
  const {userTechSkills, userSoftSkills} = req.body;
  const result = req.fileCloudinaryResult;

  if(!userSoftSkills)
    return next(new customError("Soft skills are required", 400))

  if(!userTechSkills)
    return next(new customError("Tech skills are required", 400))

  const application = new Application({
    jobId,
    userId: id,
    userTechSkills,
    userSoftSkills,
    userResume: {
      public_id: result.public_id,
      url: result.secure_url
    }
  })

  application.save()
  res.status(201).json({message : "Successfully applied to job", application : application })
})