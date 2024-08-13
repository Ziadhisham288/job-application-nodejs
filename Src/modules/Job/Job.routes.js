import express from "express"
import { verifyToken } from './../../middleware/User/verifyToken.js';
import { authorizeCompany } from './../../middleware/Company/authorizeCompany.js';
import { valdiateAddJob } from "../../middleware/Job/validateAddJob.js";
import { addJob, applyToJob, deleteJob, filterJobs, getAllJobs, getCompanyJobs, updateJob } from "./Job.controller.js";
import { validateUpdateJob } from './../../middleware/Job/validateUpdateJob.js';
import { uploadResume } from "../../middleware/Application/uploadResume.js";

const jobRouter = express.Router()


jobRouter.post("/add", verifyToken, authorizeCompany, valdiateAddJob, addJob)
jobRouter.put("/update/:jobId", verifyToken, authorizeCompany,validateUpdateJob,  updateJob)
jobRouter.delete("/delete/:jobId", verifyToken, authorizeCompany, deleteJob)
jobRouter.get("/", verifyToken, getAllJobs)
jobRouter.get("/bycompany", verifyToken, getCompanyJobs)
jobRouter.get("/filterjobs", verifyToken, filterJobs)
jobRouter.post("/:jobId", verifyToken, uploadResume, applyToJob)


export default jobRouter;