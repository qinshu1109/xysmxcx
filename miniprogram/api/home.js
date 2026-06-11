const { get } = require('../utils/request')

function getHome() {
  return get('/home')
}

module.exports = {
  getHome
}
