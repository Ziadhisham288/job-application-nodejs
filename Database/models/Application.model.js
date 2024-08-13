import mongoose from 'mongoose'

const applicationSchema = new mongoose.Schema({
  jobId : {
    type : mongoose.Types.ObjectId,
    ref : "Job"
  },
  userId: {
    type : mongoose.Types.ObjectId,
    ref : "User"
  },
  userTechSkills: {
    type : [String],
    required : true
  },
  userSoftSkills: {
    type : [String],
    required : true
  },
  userResume: {
    public_id: String,
    url: String,
  }
})

const Application = mongoose.model("Application", applicationSchema)

export default Application;