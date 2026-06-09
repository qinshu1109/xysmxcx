const { authPageData } = require('../../utils/mockData')

Page({
  data: {
    title: '登录',
    assets: authPageData.assets,
    pageText: authPageData.login,
    username: '',
    password: '',
    showPassword: false,
    state: 'ready',
    errorMessage: '',
    navHeight: 88,
    navContentTop: 44,
    menuHeight: 32
  },

  onLoad() {
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

    wx.redirectTo({ url: '/pages/mine/index' })
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

    wx.setStorageSync('authToken', 'mock-auth-token')
    wx.setStorageSync('authUser', {
      username,
      nickname: username
    })
    wx.showToast({
      title: '登录成功',
      icon: 'none'
    })

    setTimeout(() => {
      const pages = getCurrentPages()
      if (pages.length > 1) {
        wx.navigateBack()
        return
      }

      wx.redirectTo({ url: '/pages/mine/index' })
    }, 500)
  },

  onTapRegister() {
    wx.redirectTo({ url: '/pages/register/index' })
  }
})
