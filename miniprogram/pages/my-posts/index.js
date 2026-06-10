const { myPostsPage } = require('../../utils/pageAssets')
const { requireLogin } = require('../../utils/auth')
const { getMyHelpPosts } = require('../../api/me')
const { adaptHelpPost } = require('../../utils/adapters')

Page({
  data: {
    title: '我的发布',
    assets: myPostsPage.assets,
    filters: myPostsPage.filters,
    currentFilter: 'all',
    posts: [],
    visiblePosts: [],
    state: 'loading',
    errorMessage: '',
    navHeight: 88,
    navContentTop: 44,
    menuHeight: 32
  },

  onLoad() {
    this.setLayoutMetrics()
    if (requireLogin('/pages/my-posts/index')) {
      this.loadPosts()
    }
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
    this.loadPosts()
  },

  loadPosts() {
    this.setData({ state: 'loading', errorMessage: '' })
    getMyHelpPosts({
      status: this.data.currentFilter === 'all' ? '' : this.data.currentFilter,
      page: 1,
      pageSize: 50
    })
      .then((data) => {
        const posts = (data.items || []).map(adaptHelpPost)
        this.setData({
          posts,
          visiblePosts: posts,
          state: posts.length ? 'ready' : 'empty'
        })
      })
      .catch((error) => {
        this.setData({
          posts: [],
          visiblePosts: [],
          state: 'error',
          errorMessage: error && error.message ? error.message : '我的发布加载失败'
        })
      })
  },

  onTapPost(event) {
    const id = event.currentTarget.dataset.id
    if (!id) {
      return
    }
    wx.navigateTo({
      url: `/pages/help-detail/index?id=${id}`
    })
  }
})
