
import customError from './../Utils/CustomErrors.js';

// Middleware to handle async errors instead of writing try catch statements

export const handleAsyncError = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(error => next(new customError(error, 422)))
  }
}