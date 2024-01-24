class CustomError extends Error {
    constructor(statusCode, message) {
      super(message);
      this.statusCode = statusCode;
    }
}
  
function handleError(err, res) {
    const { statusCode = 400, message } = err;

    res.status(statusCode).json({
        error: {
            status: statusCode,
            message: message,
        },
    });
}
  
module.exports = {
    CustomError,
    handleError,
}