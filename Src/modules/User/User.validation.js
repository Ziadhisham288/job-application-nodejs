import Joi from "joi";

const userJoiSchema = Joi.object({
  firstName: Joi.string().required().messages({
    "string.empty" : "First name is required"
  }),
  lastName: Joi.string().required().messages({
    "string.empty" : "Last name is required"
  }),
  email: Joi.string().email().required().messages({
    "string.empty" : "Email is required",
    "string.email" : "Invalid email format"
  }),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,18}$')).required().messages({
    "string.empty" : "Password is required",
    "string.pattern.base": "Password must be between 6 and 18 characters and contain only letters and numbers"
  }),
  recoveryEmail: Joi.string().email(),
  DateOfBirth: Joi.date().iso().required().messages({
    "date.base": "Invalid date format, must be YYYY-MM-DD",
    "string.empty" : "Date of birth is required",
  }),
  mobileNumber: Joi.string().required().messages({
    "string.empty" : "Mobile number is required"
  }),
  role: Joi.string()
});


export const updateUserJoiSchema = Joi.object({
  firstName: Joi.string().optional().messages({
    "string.empty": "First name cannot be empty"
  }),
  lastName: Joi.string().optional().messages({
    "string.empty": "Last name cannot be empty"
  }),
  email: Joi.string().email().optional().messages({
    "string.email": "Invalid email format"
  }),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,18}$')).optional().messages({
    "string.pattern.base": "Password must be between 6 and 18 characters and contain only letters and numbers"
  }),
  recoveryEmail: Joi.string().email().optional().messages({
    "string.email": "Invalid recovery email format"
  }),
  DateOfBirth: Joi.date().iso().optional().messages({
    "date.base": "Invalid date format, must be YYYY-MM-DD"
  }),
  mobileNumber: Joi.string().optional().messages({
    "string.empty": "Mobile number cannot be empty"
  }),
  role: Joi.string().optional().messages({
    "string.empty": "Role cannot be empty"
  })
})



export default userJoiSchema;