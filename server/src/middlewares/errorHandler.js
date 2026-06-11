const { AppError } = require('../utils/AppError');
const { sendError } = require('../utils/response');

function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof AppError) {
    return sendError(res, error.code, error.message, null, error.httpStatus);
  }

  if (error && error.name === 'MulterError') {
    return sendError(res, 400, error.message || '上传失败');
  }

  console.error(error);
  return sendError(res, 500, '服务端错误', null, 500);
}

module.exports = { errorHandler };
