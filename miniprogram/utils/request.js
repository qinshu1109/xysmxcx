const { API_BASE_URL } = require('./config')
const auth = require('./auth')

function buildUrl(url) {
  if (/^https?:\/\//.test(url)) {
    return url
  }
  return `${API_BASE_URL}${url.startsWith('/') ? url : `/${url}`}`
}

function normalizeOptions(options) {
  if (typeof options === 'string') {
    return { url: options }
  }
  return options || {}
}

function handleUnauthorized() {
  auth.clearAuth()
  wx.showToast({
    title: '登录已过期，请重新登录',
    icon: 'none'
  })
  auth.requireLogin()
}

function request(rawOptions) {
  const options = normalizeOptions(rawOptions)
  const method = (options.method || 'GET').toUpperCase()
  const showLoading = Boolean(options.showLoading)

  if (showLoading) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
  }

  return new Promise((resolve, reject) => {
    wx.request({
      url: buildUrl(options.url),
      method,
      data: options.data || {},
      header: {
        'content-type': 'application/json',
        ...auth.getAuthHeader(),
        ...(options.header || {})
      },
      success(res) {
        const body = res.data || {}
        if (res.statusCode === 401 || body.code === 401) {
          handleUnauthorized()
          reject(body)
          return
        }

        if (res.statusCode < 200 || res.statusCode >= 300) {
          const message = body.message || '请求失败'
          wx.showToast({ title: message, icon: 'none' })
          reject(body)
          return
        }

        if (body.code === 0) {
          resolve(body.data)
          return
        }

        const message = body.message || '请求失败'
        wx.showToast({ title: message, icon: 'none' })
        reject(body)
      },
      fail(error) {
        wx.showToast({
          title: '网络请求失败',
          icon: 'none'
        })
        reject(error)
      },
      complete() {
        if (showLoading) {
          wx.hideLoading()
        }
      }
    })
  })
}

function get(url, data, options) {
  return request({ ...(options || {}), url, data, method: 'GET' })
}

function post(url, data, options) {
  return request({ ...(options || {}), url, data, method: 'POST' })
}

function put(url, data, options) {
  return request({ ...(options || {}), url, data, method: 'PUT' })
}

function patch(url, data, options) {
  return request({ ...(options || {}), url, data, method: 'PATCH' })
}

function del(url, data, options) {
  return request({ ...(options || {}), url, data, method: 'DELETE' })
}

module.exports = {
  request,
  get,
  post,
  put,
  patch,
  del
}
