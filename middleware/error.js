const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server error";

  // for cast error (eg. Invalid id)
  if (err.name === "CastError") {
    const message = `Resource not found ${err.path}`;
    err = new ErrorHandler(message, 400);
  }
  res.status(err.statusCode).json({ sucess: false, error: err.message });
};
