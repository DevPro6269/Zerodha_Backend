class ApiError extends Error {
    constructor(statusCode, message="something went wrong", stack = '') {
      super(message);  
      this.statusCode = statusCode;  
      this.timestamp = new Date();  
  
      if (stack) {
        this.stack = stack;
      }

      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  export default ApiError;
  