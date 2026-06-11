function sendSuccess(res, data = {}, message = 'ok') {
  res.json({ code: 0, message, data });
}

function sendError(res, code = 400, message = '请求参数错误', data = null, httpStatus = code) {
  res.status(httpStatus).json({ code, message, data });
}

module.exports = { sendSuccess, sendError };
