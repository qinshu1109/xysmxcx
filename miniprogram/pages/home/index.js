const { homeData } = require('../../utils/mockData')

const tabs = [
  {
    key: 'home',
    text: '首页',
    icon: '/static/home/tab_home_active_centered.png',
    active: true
  },
  {
    key: 'catbook',
    text: '猫咪图鉴',
    icon: '/static/home/tab_catbook_inactive_centered.png',
    active: false
  },
  {
    key: 'help',
    text: '求助领养',
    icon: '/static/home/tab_help_inactive_centered.png',
    active: false
  },
  {
    key: 'mine',
    text: '我的',
    icon: '/static/home/tab_mine_inactive_centered.png',
    active: false
  }
]

Page({
  data: {
    ...homeData,
    currentBannerIndex: 0,
    banners: [],
    tabs,
    statusBarHeight: 20,
    navHeight: 88,
    navContentTop: 44,
    menuHeight: 32
  },

  onLoad() {
    this.setData({
      banners: homeData.banners
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
      statusBarHeight,
      navContentTop: statusBarHeight + gap,
      menuHeight,
      navHeight: statusBarHeight + gap + menuHeight + gap
    })
  },

  onBannerChange(event) {
    this.setData({
      currentBannerIndex: event.detail.current || 0
    })
  },

  onTapBanner(event) {
    const index = event.currentTarget.dataset.index
    const banner = this.data.banners[index]
    if (!banner) {
      return
    }

    wx.showToast({
      title: '轮播图点击',
      icon: 'none'
    })
  },

  onTapQuickEntry(event) {
    if (Number(event.currentTarget.dataset.index) === 0) {
      wx.navigateTo({
        url: '/pages/cats/index'
      })
      return
    }

    wx.showToast({
      title: '后续页面开发中',
      icon: 'none'
    })
  },

  onTapMore() {
    wx.showToast({
      title: '后续页面开发中',
      icon: 'none'
    })
  },

  onTapHelpPost() {
    wx.showToast({
      title: '后续页面开发中',
      icon: 'none'
    })
  },

  onTapTab(event) {
    const key = event.currentTarget.dataset.key
    if (key === 'home') {
      return
    }

    if (key === 'catbook') {
      wx.navigateTo({
        url: '/pages/cats/index'
      })
      return
    }

    if (key === 'help') {
      wx.navigateTo({
        url: '/pages/help/index'
      })
      return
    }

    if (key === 'mine') {
      wx.navigateTo({
        url: '/pages/mine/index'
      })
      return
    }

    wx.showToast({
      title: '后续页面开发中',
      icon: 'none'
    })
  }
})
