const { del, get } = require('../utils/request')

function getMyHelpPosts(params) {
  return get('/me/help-posts', params || {})
}

function getMyProfile() {
  return get('/me/profile')
}

function getMyComments(params) {
  return get('/me/comments', params || {})
}

function deleteMyComment(id) {
  return del(`/me/comments/${id}`)
}

module.exports = {
  getMyHelpPosts,
  getMyProfile,
  getMyComments,
  deleteMyComment
}
