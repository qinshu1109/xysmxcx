const { myPostsPageData } = require('../../utils/mockData')

Page({
  data: {
    title: '我的发布',
    assets: myPostsPageData.assets,
    filters: myPostsPageData.filters,
    currentFilter: 'all',
    posts: myPostsPageData.posts,
    visiblePosts: myPostsPageData.posts,
    state: 'ready',
    errorMessage: '',
    navHeight: 88,
    navContentTop: 44,
    menuHeight: 32
  },

  onLoad() {
    this.setLayoutMetrics()
    this.applyFilter()
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

  onTapFilter(event) {
    const value = event.currentTarget.dataset.value || 'all'
    if (value === this.data.currentFilter) {
      return
    }

    this.setData({ currentFilter: value })
    this.applyFilter()
  },

  applyFilter() {
    const filter = this.data.currentFilter
    const visiblePosts = this.data.posts.filter((post) => filter === 'all' || post.status === filter)

    this.setData({
      visiblePosts,
      state: visiblePosts.length ? 'ready' : 'empty'
    })
  },

  onTapPost(event) {
    const id = event.currentTarget.dataset.id || 1
    wx.navigateTo({
      url: `/pages/help-detail/index?id=${id}`
    })
  }
})
