const { minePageData } = require('../../utils/mockData')

Page({
  data: {
    title: '我的',
    isLoggedIn: false,
    user: minePageData.user,
    assets: minePageData.assets,
    guestMenus: minePageData.guestMenus,
    userMenus: minePageData.userMenus,
    state: 'ready',
    errorMessage: '',
    navHeight: 88,
    navContentTop: 44,
    menuHeight: 32
  },

  onLoad() {
    this.setLayoutMetrics()
    this.syncLoginState()
  },

  onShow() {
    this.syncLoginState()
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

  syncLoginState() {
    const token = wx.getStorageSync('authToken')
    this.setData({
      isLoggedIn: Boolean(token)
    })
  },

  onTapLogin() {
    wx.navigateTo({ url: '/pages/login/index' })
  },

  onTapMenu(event) {
    const key = event.currentTarget.dataset.key
    if (key === 'logout') {
      wx.removeStorageSync('authToken')
      wx.removeStorageSync('authUser')
      this.setData({ isLoggedIn: false })
      wx.showToast({
        title: '已退出登录',
        icon: 'none'
      })
      return
    }

    if (!this.data.isLoggedIn && (key === 'posts' || key === 'comments')) {
      wx.navigateTo({ url: '/pages/login/index' })
      return
    }

    if (key === 'about') {
      wx.showToast({
        title: '校园拾喵驿站',
        icon: 'none'
      })
      return
    }

    if (key === 'posts') {
      wx.navigateTo({ url: '/pages/my-posts/index' })
      return
    }

    if (key === 'comments') {
      wx.navigateTo({ url: '/pages/my-comments/index' })
      return
    }

    wx.showToast({
      title: '后续页面开发中',
      icon: 'none'
    })
  }
})
