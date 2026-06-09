const { myCommentsPageData } = require('../../utils/mockData')

Page({
  data: {
    title: '我的评论',
    assets: myCommentsPageData.assets,
    comments: myCommentsPageData.comments,
    state: 'ready',
    errorMessage: '',
    navHeight: 88,
    navContentTop: 44,
    menuHeight: 32
  },

  onLoad() {
    this.setLayoutMetrics()
    this.setData({
      state: this.data.comments.length ? 'ready' : 'empty'
    })
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

  onTapDetail(event) {
    const item = this.data.comments.find((comment) => comment.id === Number(event.currentTarget.dataset.id))
    if (!item) {
      return
    }

    if (item.targetType === 'cat') {
      wx.navigateTo({
        url: `/pages/cat-detail/index?id=${item.targetId}`
      })
      return
    }

    wx.navigateTo({
      url: `/pages/help-detail/index?id=${item.targetId}`
    })
  }
})
