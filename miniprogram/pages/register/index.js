const { authPageData } = require('../../utils/mockData')

Page({
  data: {
    title: '注册账号',
    assets: authPageData.assets,
    pageText: authPageData.register,
    username: '',
    nickname: '',
    password: '',
    confirmPassword: '',
    showPassword: false,
    showConfirmPassword: false,
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

    wx.redirectTo({ url: '/pages/login/index' })
  },

  onUsernameInput(event) {
    this.setData({ username: event.detail.value || '' })
  },

  onNicknameInput(event) {
    this.setData({ nickname: event.detail.value || '' })
  },

  onPasswordInput(event) {
    this.setData({ password: event.detail.value || '' })
  },

  onConfirmPasswordInput(event) {
    this.setData({ confirmPassword: event.detail.value || '' })
  },

  onTogglePassword() {
    this.setData({ showPassword: !this.data.showPassword })
  },

  onToggleConfirmPassword() {
    this.setData({ showConfirmPassword: !this.data.showConfirmPassword })
  },

  onSubmit() {
    const username = this.data.username.trim()
    const nickname = this.data.nickname.trim()
    const password = this.data.password.trim()
    const confirmPassword = this.data.confirmPassword.trim()

    if (!username || !nickname || !password || !confirmPassword) {
      wx.showToast({
        title: '请完整填写注册信息',
        icon: 'none'
      })
      return
    }

    if (password !== confirmPassword) {
      wx.showToast({
        title: '两次密码不一致',
        icon: 'none'
      })
      return
    }

    wx.showToast({
      title: '注册成功',
      icon: 'none'
    })

    setTimeout(() => {
      wx.redirectTo({ url: '/pages/login/index' })
    }, 500)
  },

  onTapLogin() {
    wx.redirectTo({ url: '/pages/login/index' })
  }
})
