import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  industry: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  numberOfEmployees: {
    type: Number,
    min: 11,
    max: 20,
    required: true
  },
  companyEmail : {
    type : String,
    required : true,
    unique: true
  },
  companyHR : {
    type : mongoose.Types.ObjectId,
    ref : "User"
  }
},
{
  versionKey: false,
  timestamps : true
});


const Company = mongoose.model("Company", companySchema); 

export default Company;
