function notFound(req, res, next) {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
}

function newError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message;

  // Log detailed error in development
  if (process.env.NODE_ENV === "development") {
    console.error("🔥 Error:", {
      path: req.path,
      method: req.method,
      error: err.stack,
    });
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
}

export { notFound, errorHandler, newError };
