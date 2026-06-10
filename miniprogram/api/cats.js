const { get } = require('../utils/request')

function getCats(params) {
  return get('/cats', params || {})
}

function getCatDetail(id) {
  return get(`/cats/${id}`)
}

module.exports = {
  getCats,
  getCatDetail
}
