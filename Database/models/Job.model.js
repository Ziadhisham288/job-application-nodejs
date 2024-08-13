import mongoose from 'mongoose'

const jobSchema = new mongoose.Schema({
  jobTitle: {
    type : String,
    required: true
  },
  jobLocation: {
    type : String,
    required: true,
    enum: ["onsite", "remote", "hybrid"]
  },
  workingTime : {
    type : String,
    required : true,
    enum: ["part-time", "full-time"]
  },
  senorityLevel : {
    type : String,
    required : true,
    enum: ["junior", "mid-level", "senior", "team-lead", "CTO"]
  },
  jobDescription : { 
    type : String,
    required: true,
  },
  technicalSkills : {
    type : [String],
    required : true
  },
  softSkills: {
    type : [String],
    required : true
  },
  addedBy : {
    type : mongoose.Types.ObjectId,
    ref : "User",
    required : true
  }
})

const Job = mongoose.model("Job", jobSchema);

export default Job;