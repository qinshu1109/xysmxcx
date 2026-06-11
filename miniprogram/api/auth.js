const { post } = require('../utils/request')

function login(data) {
  return post('/auth/login', data, { showLoading: true })
}

function register(data) {
  return post('/auth/register', data, { showLoading: true })
}

module.exports = {
  login,
  register
}
