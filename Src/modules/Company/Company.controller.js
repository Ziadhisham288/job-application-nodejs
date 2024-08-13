import Application from "../../../Database/models/Application.model.js";
import { handleAsyncError } from "../../middleware/asyncHandler.js";
import customError from "../../Utils/CustomErrors.js";
import Company from "./../../../Database/models/Company.model.js";
import Job from './../../../Database/models/Job.model.js';

// Adds a new company to the database

export const addCompany = handleAsyncError(async (req, res, next) => {
  const { id } = req.user;
  const {
    companyName,
    description,
    industry,
    address,
    numberOfEmployees,
    companyEmail,
  } = req.body;


  const company = new Company({
    companyName,
    description,
    industry,
    address,
    numberOfEmployees,
    companyEmail,
    companyHR: id,
  });

  company.save();

  res
    .status(201)
    .json({ message: "Company added successfully", Company: company });
});

// Updates the information of a company, Only the company HR is authorized.

export const updateCompanyData = handleAsyncError(async (req,res,next) => {
  const {id} = req.user
  const {companyEmail, companyName, description, numberOfEmployees, address, industry} = req.body;
  let infoToUpdate = {};

  const companyHR = await Company.findOne({companyHR : id})

  if(!companyHR)
    return next(new customError("Only the company HR can update company data", 401))


  if (description) infoToUpdate.description = description;
  if (numberOfEmployees) infoToUpdate.numberOfEmployees = numberOfEmployees;
  if (address) infoToUpdate.address = address;
  if (companyName) infoToUpdate.companyName = companyName;
  if (companyEmail) infoToUpdate.companyEmail = companyEmail;
  if (industry) infoToUpdate.industry = industry;

  const company = await Company.findOneAndUpdate({companyHR : id}, infoToUpdate, {
    new : true
  }).populate("companyHR")

  res.status(200).json({message : "Company data updated successfully", Company : company})
})

// Deletes a company and all its jobs and applications. Only the company HR can delete the company.

export const deleteCompany = handleAsyncError(async (req,res, next) => {
  const { id } = req.user; 

  const company = await Company.findOne({ companyHR: id });

  if (!company) {
    return next(new customError("Company not found or you are not authorized to delete this company", 404));
  }

  const jobs = await Job.find({addedBy: id})
  const jobsIds = jobs.map(job => job._id)

  await Company.findOneAndDelete({ companyHR: id });
  await Application.deleteMany({
    jobId : {
      $in : jobsIds
    }
  })
  await Job.deleteMany({addedBy : id})
  res.status(200).json({ message: "Company deleted successfully" });
})

// Gets the information of a specific company by its ID.

export const getCompanyInfo = handleAsyncError(async (req,res,next) => {
  const { id } = req.params;

  const companyInfo = await Company.findById(id).populate({
    path: 'companyHR',
    select: '-password -createdAt -updatedAt -DateOfBirth' 
  }).select("-updatedAt")

  if(!companyInfo)
    return next(new customError("Company not found", 404))

  res.status(200).json({message : `Here's the available information on ${companyInfo.companyName}`, companyInfo})
})

// Searches for a company by its name, returns company information.

export const searchCompany = handleAsyncError(async (req,res,next) => {
  const { company } = req.query;

  const companyInfo = await Company.findOne({companyName : company}).populate({
    path: 'companyHR',
    select: '-password -createdAt -updatedAt -DateOfBirth' 
  }).select("-updatedAt")

  if(!companyInfo)
    return next(new customError("Company not found", 404))

  res.status(200).json({message : `Here's the available information on ${companyInfo.companyName}`, companyInfo})
})

// Gets all applications for a specific job, Only the company hr that added the job is authorized.

export const getApplicationsForJob =  handleAsyncError(async (req,res, next) => {
  const {id} = req.user;
  const {jobId} = req.params;

  const job = await Job.findById(jobId)

  if(!job)
    return next(new customError("Job not found", 404))

  if(id != job.addedBy)
    return next(new customError("Not authorized to see applications", 401))

  const applications = await Application.find({jobId}).populate({
    path : 'userId',
    select : '-password -createdAt -role -updatedAt'
  })


  res.status(200).json({message : `All applications for the ${job.jobTitle} role`, Applications: applications})
})


