const { API_ORIGIN } = require('./config')

function normalizeImageUrl(url) {
  if (!url) {
    return ''
  }

  if (/^https?:\/\//.test(url)) {
    return url
  }

  if (url.startsWith('/uploads/')) {
    return `${API_ORIGIN}${url}`
  }

  if (url.startsWith('/static/')) {
    return url
  }

  return url
}

module.exports = {
  normalizeImageUrl
}
