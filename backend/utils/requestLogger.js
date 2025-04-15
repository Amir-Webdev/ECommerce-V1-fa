function requestLogger(req, res, next) {
  if (process.env.NODE_ENV === "development") {
    console.log(`📨 ${req.method} ${req.path}`);
  }
  next();
}

export default requestLogger;
