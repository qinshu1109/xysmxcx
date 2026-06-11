const { get, post } = require('../utils/request')

function getHelpPosts(params) {
  return get('/help-posts', params || {})
}

function getHelpPostDetail(id) {
  return get(`/help-posts/${id}`)
}

function createHelpPost(data) {
  return post('/help-posts', data, { showLoading: true })
}

module.exports = {
  getHelpPosts,
  getHelpPostDetail,
  createHelpPost
}
