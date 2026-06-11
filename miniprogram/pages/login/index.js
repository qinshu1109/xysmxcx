const { authPage } = require('../../utils/pageAssets')
const { setAuth } = require('../../utils/auth')
const { login } = require('../../api/auth')

const tabPages = [
  '/pages/home/index',
  '/pages/cats/index',
  '/pages/help/index',
  '/pages/mine/index'
]

Page({
  data: {
    title: '登录',
    assets: authPage.assets,
    pageText: authPage.login,
    username: '',
    password: '',
    showPassword: false,
    redirect: '',
    state: 'ready',
    errorMessage: '',
    navHeight: 88,
    navContentTop: 44,
    menuHeight: 32
  },

  onLoad(options) {
    this.setData({
      redirect: options && options.redirect ? decodeURIComponent(options.redirect) : ''
    })
    this.setLayoutMetrics()
  },

  setLayoutMetrics() {
    const win = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync()
    const menu = wx.getMenuButtonBoundingClientRect ? wx.getMenuButtonBoundingClientRect() : null
    const statusBarHeight = win.statusBarHeight || 20
    const menuTop = menu && menu.top ? menu.top : statusBarHeight + 8
    const menuHeight = menu && menu.height ? menu.height : 32
    const gap = Math.max(menuTop - statusBarHeight, 6)

    this.setData({
      navContentTop: statusBarHeight + gap,
      menuHeight,
      navHeight: statusBarHeight + gap + menuHeight + gap
    })
  },

  onTapBack() {
    const pages = getCurrentPages()
    if (pages.length > 1) {
      wx.navigateBack()
      return
    }

    wx.switchTab({ url: '/pages/mine/index' })
  },

  onUsernameInput(event) {
    this.setData({ username: event.detail.value || '' })
  },

  onPasswordInput(event) {
    this.setData({ password: event.detail.value || '' })
  },

  onTogglePassword() {
    this.setData({ showPassword: !this.data.showPassword })
  },

  onSubmit() {
    const username = this.data.username.trim()
    const password = this.data.password.trim()

    if (!username || !password) {
      wx.showToast({
        title: '请输入用户名和密码',
        icon: 'none'
      })
      return
    }

    this.setData({ state: 'loading', errorMessage: '' })
    login({ username, password })
      .then((data) => {
        setAuth(data.token, data.user)
        wx.showToast({
          title: '登录成功',
          icon: 'none'
        })
        setTimeout(() => {
          this.goAfterLogin()
        }, 300)
      })
      .catch((error) => {
        this.setData({
          state: 'ready',
          errorMessage: error && error.message ? error.message : '登录失败'
        })
      })
  },

  goAfterLogin() {
    const redirect = this.data.redirect || '/pages/home/index'
    const path = redirect.split('?')[0]

    if (tabPages.indexOf(path) >= 0) {
      wx.switchTab({ url: path })
      return
    }

    wx.redirectTo({
      url: redirect
    })
  },

  onTapRegister() {
    wx.redirectTo({ url: '/pages/register/index' })
  }
})
