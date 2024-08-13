
// Defines a custom error class that extends the built-in Error class and adds the HTTP status code 

export default class customError extends Error {
  constructor(message, statusCode){
    super(message)
    this.statusCode = statusCode;
  }
}