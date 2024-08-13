import Joi from 'joi'


export const addJobJoiSchema = Joi.object({
  jobTitle : Joi.string().required().messages({
    "string.empty" : "Job title is required"
  }),
  jobLocation : Joi.string().valid("onsite", "remote", "hybrid").required().messages({
    "string.empty" : "Job location is required",
    "any.only" : "Invalid job location, Need to be onsite, remote or hybrid"
  }),
  workingTime : Joi.string().required().valid("part-time", "full-time").messages({
    "string.empty" : "Working time is requried",
    "any.only" : "Invalid working time, Need to be part-time or full-time"
  }),
  senorityLevel : Joi.string().required().valid("junior", "mid-level", "senior", "team-lead", "CTO").messages({
    "string.empty" : "Senority level is required",
    "any.only" : "Invalid senority level, Need to be junior, mid-level, senior, team-lead or CTO"
  }),
  jobDescription : Joi.string().required().messages({
    "string.empty" : "job description is required"
  }),
  technicalSkills : Joi.array().min(1).unique().items(Joi.string()).required().messages({
    "array.min" : "Must add atleast one technical skill",
    "array.unique" : "Technical skills can't have duplicates",
  }),
  softSkills : Joi.array().min(1).unique().items(Joi.string()).required().messages({
    "array.items": "Each soft skill must be a string",
    "array.min" : "Must add atleast one soft skill",
    "array.unique" : "Soft skills can't have duplicates",
  })
}) 


export const updateJobJoiSchema = Joi.object({
  jobTitle: Joi.string().optional().messages({
    "string.empty": "Job title cannot be empty"
  }),
  jobLocation: Joi.string().valid("onsite", "remote", "hybrid").optional().messages({
    "any.only": "Invalid job location, it must be onsite, remote, or hybrid"
  }),
  workingTime: Joi.string().valid("part-time", "full-time").optional().messages({
    "any.only": "Invalid working time, it must be part-time or full-time"
  }),
  senorityLevel: Joi.string().valid("junior", "mid-level", "senior", "team-lead", "CTO").optional().messages({
    "any.only": "Invalid senority level, it must be junior, mid-level, senior, team-lead, or CTO"
  }),
  jobDescription: Joi.string().optional().messages({
    "string.empty": "Job description cannot be empty"
  }),
  technicalSkills: Joi.array().unique().items(Joi.string()).optional().messages({
    "array.unique": "Technical skills can't have duplicates",
    "array.items": "Each technical skill must be a string"
  }),
  softSkills: Joi.array().unique().items(Joi.string()).optional().messages({
    "array.items": "Each soft skill must be a string",
    "array.unique": "Soft skills can't have duplicates"
  })
})