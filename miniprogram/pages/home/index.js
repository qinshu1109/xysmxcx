const { getHome } = require('../../api/home')
const { adaptHome } = require('../../utils/adapters')
const { requireLogin } = require('../../utils/auth')

Page({
  data: {
    platformName: '校园拾喵驿站',
    homeSlogan: '',
    homeSubtitle: '',
    currentBannerIndex: 0,
    banners: [],
    stats: {
      catCount: 0,
      helpPostCount: 0,
      adoptionSuccessCount: 0
    },
    latestHelpPosts: [],
    recommendedCats: [],
    state: 'loading',
    errorMessage: '',
    statusBarHeight: 20,
    navHeight: 88,
    navContentTop: 44,
    menuHeight: 32
  },

  onLoad() {
    this.setLayoutMetrics()
  },

  onShow() {
    this.loadHome()
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

  loadHome() {
    this.setData({ state: 'loading', errorMessage: '' })
    getHome()
      .then((data) => {
        const home = adaptHome(data || {})
        this.setData({
          ...home,
          currentBannerIndex: 0,
          state: 'ready'
        })
      })
      .catch((error) => {
        this.setData({
          state: 'error',
          errorMessage: error && error.message ? error.message : '首页数据加载失败'
        })
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

    if (banner.linkType === 'cat' && banner.linkTarget) {
      wx.navigateTo({ url: `/pages/cat-detail/index?id=${banner.linkTarget}` })
      return
    }

    if (banner.linkType === 'help_post' && banner.linkTarget) {
      wx.navigateTo({ url: `/pages/help-detail/index?id=${banner.linkTarget}` })
      return
    }
  },

  onTapQuickEntry(event) {
    if (Number(event.currentTarget.dataset.index) === 0) {
      wx.switchTab({
        url: '/pages/cats/index'
      })
      return
    }

    if (Number(event.currentTarget.dataset.index) === 2) {
      if (requireLogin('/pages/publish/index')) {
        wx.navigateTo({ url: '/pages/publish/index' })
      }
      return
    }

    wx.showToast({
      title: '后续页面开发中',
      icon: 'none'
    })
  },

  onTapMore() {
    wx.switchTab({
      url: '/pages/help/index'
    })
  },

  onTapHelpPost(event) {
    const id = event.currentTarget.dataset.id
    if (!id) {
      return
    }
    wx.navigateTo({
      url: `/pages/help-detail/index?id=${id}`
    })
  }
})
