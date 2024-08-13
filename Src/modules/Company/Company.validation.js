import Joi from 'joi'

export const addCompanyJoiSchema = Joi.object({
  companyName : Joi.string().required().messages({
    "string.empty" : "Company name is required"
  }),
  description : Joi.string().required().messages({
    "string.empty" : "Company description is required"
  }),
  industry : Joi.string().required().messages({
    "string.empty" : "Company's industry is requried"
  }),
  address : Joi.string().required().messages({
    "string.empty" : "Company address is required"
  }),
  numberOfEmployees : Joi.number().required().min(11).max(20).messages({
    "number.base" : "The number of employees is required",
    "number.min" : "Number of employees must be more than 11",
    "number.max" : "Number of employees can't exceed 20"
  }),
  companyEmail : Joi.string().email().required().messages({
    "string.empty" : "Company email is required"
  })
}) 

export const updateCompanyJoiSchema = Joi.object({
  companyName: Joi.string().optional().messages({
    "string.empty": "Company name cannot be empty"
  }),
  description: Joi.string().optional().messages({
    "string.empty": "Description cannot be empty"
  }),
  industry: Joi.string().optional().messages({
    "string.empty": "Industry cannot be empty"
  }),
  address: Joi.string().optional().messages({
    "string.empty": "Address cannot be empty"
  }),
  numberOfEmployees: Joi.number().min(11).max(20).optional().messages({
    "number.min": "Number of employees must be more than 11",
    "number.max": "Number of employees can't exceed 20"
  }),
  companyEmail: Joi.string().email().optional().messages({
    "string.email": "Invalid company email format"
  })
})

