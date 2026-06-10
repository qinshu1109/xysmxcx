const TOKEN_KEY = 'authToken'
const USER_KEY = 'authUser'

function getToken() {
  return wx.getStorageSync(TOKEN_KEY) || ''
}

function getUser() {
  return wx.getStorageSync(USER_KEY) || null
}

function getUserRole() {
  const user = getUser()
  return user && user.role === 'admin' ? 'admin' : 'user'
}

function setAuth(token, user) {
  wx.setStorageSync(TOKEN_KEY, token)
  wx.setStorageSync(USER_KEY, user)
}

function clearAuth() {
  wx.removeStorageSync(TOKEN_KEY)
  wx.removeStorageSync(USER_KEY)
}

function isLoggedIn() {
  return Boolean(getToken())
}

function isAdminUser() {
  return isLoggedIn() && getUserRole() === 'admin'
}

function getAuthHeader() {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

function getCurrentRoute() {
  const pages = getCurrentPages()
  const current = pages[pages.length - 1]
  if (!current) {
    return '/pages/home/index'
  }

  const options = current.options || {}
  const query = Object.keys(options)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(options[key])}`)
    .join('&')
  return `/${current.route}${query ? `?${query}` : ''}`
}

function requireLogin(redirectUrl) {
  if (isLoggedIn()) {
    return true
  }

  const redirect = encodeURIComponent(redirectUrl || getCurrentRoute())
  wx.navigateTo({
    url: `/pages/login/index?redirect=${redirect}`
  })
  return false
}

module.exports = {
  getToken,
  getUser,
  getUserRole,
  setAuth,
  clearAuth,
  isLoggedIn,
  isAdminUser,
  requireLogin,
  getAuthHeader
}
