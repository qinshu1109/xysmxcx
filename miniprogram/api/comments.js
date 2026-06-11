const { get, post } = require('../utils/request')

function getComments(params) {
  return get('/comments', params || {})
}

function createComment(data) {
  return post('/comments', data, { showLoading: true })
}

module.exports = {
  getComments,
  createComment
}
