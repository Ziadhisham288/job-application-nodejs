import crypto from 'crypto'

// A helper function to generate an OTP 

export const generateOTP = () =>  {
  let length = 6
  const otp = crypto.randomBytes(length).toString('hex').slice(0, length).toUpperCase();
  return otp;
}