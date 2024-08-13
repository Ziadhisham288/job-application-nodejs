import { User } from "../../../Database/models/User.model.js";
import { handleAsyncError } from "../../middleware/asyncHandler.js";
import bcrypt from "bcryptjs";
import customError from "../../Utils/CustomErrors.js";
import jwt from "jsonwebtoken";
import { generateOTP } from "../../Utils/generateOtp.js";
import { transporter } from "./../../config/nodemailer.config.js";
import Application from "../../../Database/models/Application.model.js";
import Company from "../../../Database/models/Company.model.js";
import Job from "../../../Database/models/Job.model.js";

// Registers a new user in the system, creating a new user in the database.

export const signUp = handleAsyncError(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    password,
    recoveryEmail,
    DateOfBirth,
    mobileNumber,
    role,
  } = req.body;

  const userName = firstName + lastName;

  const user = new User({
    firstName,
    lastName,
    userName,
    email,
    password,
    recoveryEmail,
    DateOfBirth,
    mobileNumber,
    role,
  });

  user.save();

  res.status(201).json({
    message: "Successfully signed up",
    user: {
      firstName,
      lastName,
      userName,
      email,
      recoveryEmail,
      DateOfBirth,
      mobileNumber,
      role,
    },
  });
});

// Authenticates a user using their email, recovery email, or mobile number along with their password.
// Sets the user's status to "Online" and generates a JWT token for authenticated requests.

export const signIn = handleAsyncError(async (req, res, next) => {
  const { email, recoveryEmail, mobileNumber, password } = req.body;

  let user;

  // Sign in by email, mobile number or recovery email

  if (email) {
    user = await User.findOne({ email });
  }

  if (mobileNumber) {
    user = await User.findOne({ mobileNumber });
  }

  if (recoveryEmail) {
    user = await User.findOne({ recoveryEmail });
  }

  if (!user)
    return next(new customError("No user found, please register first", 404));

  let passwordMatch = bcrypt.compareSync(password, user.password);

  if (!passwordMatch) return next(new customError("Wrong password", 401));

  await User.findByIdAndUpdate(user._id, {
    status: "Online",
  });

  const token = jwt.sign(
    {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userName,
      DateOfBirth: user.DateOfBirth,
      email: user.email,
      role: user.role,
      status: user.status,
    },
    process.env.JWT_SECRET_KEY
  );

  res.status(200).json({ message: "Successfully signed in", token: token });
});

// Updates a user's information, such as email, recovery email, mobile number, date of birth, and name.
// Requires the user to be logged in (status: "Online").

export const updateInfo = handleAsyncError(async (req, res, next) => {
  const { id, status } = req.user;
  const {
    email,
    recoveryEmail,
    mobileNumber,
    DateOfBirth,
    lastName,
    firstName,
  } = req.body;

  let infoToUpdate = {};

  // Constructing the infoToUpdate object

  if (email) infoToUpdate.email = email;
  if (recoveryEmail) infoToUpdate.recoveryEmail = recoveryEmail;
  if (mobileNumber) infoToUpdate.mobileNumber = mobileNumber;
  if (DateOfBirth) infoToUpdate.DateOfBirth = DateOfBirth;
  if (lastName) infoToUpdate.lastName = lastName;
  if (firstName) infoToUpdate.firstName = firstName;

  // Check if user is logged in  ==>  "Online"

  if (status === "Online") {
    const user = await User.findByIdAndUpdate(id, infoToUpdate, {
      new: true,
    }).select("-password");
    res
      .status(201)
      .json({ message: "Updated information successfully", user: user });
  } else {
    next(new customError("User must be online to update info", 403));
  }
});

// Deletes a user's account. Requires the user to be logged in (status: "Online").
// If the user is a Company HR, also deletes the associated company, jobs, and applications.

export const deleteAccount = handleAsyncError(async (req, res, next) => {
  const { id, status, role } = req.user;

  if(status === "Online" && role === "Company_HR"){
    await User.findByIdAndDelete(id);
    await Company.findOneAndDelete({companyHR : id})
    await Application.deleteMany({userId : id})
    await Job.deleteMany({addedBy : id})
    return res.status(200).json({ message: "Account deleted" });
  } else {
    next(new customError("User must be online to delete account", 403));
  }

  if (status === "Online") {
    await User.findByIdAndDelete(id);
    await Application.deleteMany({userId : id})
    res.status(200).json({ message: "Account deleted" });
  } else {
    next(new customError("User must be online to delete account", 403));
  }
});

// Gets the currently logged-in user's information, excluding the password.

export const getUserInfo = handleAsyncError(async (req, res, next) => {
  const { id } = req.user;

  const user = await User.findById(id).select("-password");

  res
    .status(200)
    .json({ message: `${user.firstName}'s account info`, info: user });
});

// Gets the information of another user by their ID, excluding the password.

export const getAnotherAccountInfo = handleAsyncError(
  async (req, res, next) => {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");

    res
      .status(200)
      .json({ message: `${user.firstName}'s account info`, info: user });
  }
);

// Updates the password of the currently logged-in user.
// Requires the user to provide their current password and the new password.

export const updatePassword = handleAsyncError(async (req, res, next) => {
  const { id } = req.user;
  const { currentPassword, newPassword } = req.body;

  let user = await User.findById(id);

  const isMatch = bcrypt.compareSync(currentPassword, user.password);

  if (!isMatch)
    return next(new customError("Current password is incorrect", 400));

  const hashedNewPassword = bcrypt.hashSync(newPassword, 10);

  user.password = hashedNewPassword;
  user.save();

  res.status(201).json({ message: "Password updated successfully" });
});

// Starts the password reset process for a user by sending an OTP to their email.

export const forgotPassword = handleAsyncError(async (req, res, next) => {
  const { email } = req.body;

  if (!email) return next(new customError("Email is required", 404));

  const user = await User.findOne({ email });

  if (!user) return next(new customError("User not found", 404));

  const otp = generateOTP();
  user.resetPasswordOTP = otp;
  await user.save();

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Password Reset OTP",
    text: `Your OTP is ${otp}`,
  };

  await transporter.sendMail(mailOptions);
  res.status(200).json({ message: "Please check email for OTP" });
});

// Resets a user's password using the OTP and new password.

export const resetPassword = handleAsyncError(async (req, res, next) => {
  const { email, otp, newPassword } = req.body;

  if (!email) return next(new customError("Email is required", 400));

  if (!otp) return next(new customError("OTP is required", 400));
  if (!newPassword)
    return next(new customError("New password is required", 400));

  const user = await User.findOne({ email });

  if (!user) return next(new customError("User not found", 404));

  if (otp !== user.resetPasswordOTP)
    return next(new customError("Invalid OTP", 400));

  const hashedPassword = bcrypt.hashSync(newPassword, 10);

  user.password = hashedPassword;
  user.resetPasswordOTP = undefined;

  await user.save();

  res.status(200).json({ message: "Password changed successfully" });
});

// Gets all accounts associated with the currently logged-in user's recovery email, excluding passwords.

export const getAllAccountsForRecoveryAccount = handleAsyncError(
  async (req, res, next) => {
    const { id } = req.user;

    const user = await User.findById(id);

    const accounts = await User.find({
      recoveryEmail: user.recoveryEmail,
    }).select("-password");

    if (accounts.length === 0)
      return next(new customError("No accounts found"), 404);

    res.status(200).json({
      message: "All accounts associated with your recovery email",
      accounts: accounts,
    });
  }
);
