class AppError extends Error {
  constructor(message, code = 400, httpStatus = code) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.httpStatus = httpStatus;
  }
}

module.exports = { AppError };
