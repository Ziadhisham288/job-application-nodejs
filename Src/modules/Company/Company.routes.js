import express from "express"
import { verifyToken } from './../../middleware/User/verifyToken.js';
import { authorizeCompany } from "../../middleware/Company/authorizeCompany.js";
import { validateAddCompany } from '../../middleware/Company/validateAddCompany.js';
import { addCompany, deleteCompany, getApplicationsForJob, getCompanyInfo, searchCompany, updateCompanyData } from "./Company.controller.js";
import { validateUpdateCompany } from "../../middleware/Company/validateUpdateCompany.js";
import { checkCompanyExists } from "../../middleware/Company/checkCompanyExists.js";

const companyRouter = express.Router()



companyRouter.post("/addcompany", verifyToken, authorizeCompany, checkCompanyExists, validateAddCompany,  addCompany )
companyRouter.put("/updatecompany", verifyToken, authorizeCompany, checkCompanyExists, validateUpdateCompany, updateCompanyData )
companyRouter.delete("/deletecompany", verifyToken, authorizeCompany, deleteCompany )
companyRouter.get("/companyinfo/:id", verifyToken, authorizeCompany, getCompanyInfo )
companyRouter.get("/searchcompany", verifyToken, searchCompany)
companyRouter.get("/applications/:jobId", verifyToken, authorizeCompany, getApplicationsForJob)


export default companyRouter;

