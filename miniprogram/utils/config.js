const API_BASE_URL = 'http://localhost:3000/api'
const USE_MOCK = false

function getApiOrigin() {
  return API_BASE_URL.replace(/\/api\/?$/, '')
}

module.exports = {
  API_BASE_URL,
  USE_MOCK,
  API_ORIGIN: getApiOrigin()
}
