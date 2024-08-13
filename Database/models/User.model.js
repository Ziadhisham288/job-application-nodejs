import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  userName: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  recoveryEmail: {
    type: String,
  },
  DateOfBirth: {
    type: Date,
    required: true
  },
  mobileNumber: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ["User", "Company_HR"],
    default: "User",
  },
  status: {
    type: String,
    enum: ["Online" , "Offline"],
    default: "Offline",
  },
  resetPasswordOTP :{
    type : String
  }
},
{
  versionKey: false,
  timestamps: true
});

export const User = mongoose.model("User", userSchema);
